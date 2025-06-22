const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const { check, validationResult } = require("express-validator");
const User = require("./models/userModel.js");
const Chat = require("./models/Chat.js");
const Contact = require("./models/Contact.js");
const { Mistral } = require("@mistralai/mistralai")
const { OAuth2Client } = require("google-auth-library")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;



// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("tiny")); 
app.set('trust proxy', 1);


const allowedOrigins = ["https://hitchpath.com", "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

{/*app.use('/api/admin', adminCourseRoutes);
app.use('/api/admin/work-essentials', adminWorkEssentials);*/}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

  // OpenAI API configuration
//const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Mistral AI configuration
const mistral = new Mistral({ apiKey: MISTRAL_API_KEY });

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the HitchPath server!");
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).send("Access denied");
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      const message = err.name === "TokenExpiredError" ? "Token expired, please log in again" : "Invalid token";
      return res.status(403).send(message);
    }

    req.user = user;
    next();
  });
};

app.get('/ads.txt', function (req, res) {
  res.sendFile(__dirname + '/public/ads.txt');
});

// Registration endpoint
app.post(
  "/register",
  [
    check("email").isEmail().withMessage("Invalid email address."),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    check("name").notEmpty().withMessage("Name is required."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin }, JWT_SECRET);

      res.status(201).json({
        message: "User registered successfully.",
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Server error." });
    }
  }
);


// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error." });
  }
});

app.post("/google-login", async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not exists
      user = new User({
        name,
        email,
        googleId: payload.sub, // Store the Google ID
        password: null, // No password required for Google users
      });
      await user.save();
    }

    // Generate a JWT for the user
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Adjust token expiration as needed
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed. Please try again." });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save contact data.' });
  }
});

// User profile endpoint
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update user information endpoint
app.post("/api/user/update", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User information updated successfully.", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/user-info/completed", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if required fields are completed
    const isUserInfoComplete = user.name && user.email && user.careerPath && user.currentSkillLevel;

    if (isUserInfoComplete) {
      res.json({ completed: true });
    } else {
      res.json({ completed: false });
    }
  } catch (error) {
    console.error("Error checking user info:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/generate-learning-path", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // If the user already has a saved learning path, return it
    if (user.hasSavedLearningPath) {
      return res.json({ learningPath: user.learningPath });
    }

    // If not, generate a new learning path
     // Fetch user preferences from the database (use defaults if necessary)
     const careerPath = user.careerPath;
     const currentSkillLevel = user.currentSkillLevel;
     const preferredLearningStyle = user.preferredLearningStyle;

    const prompt = `
      Based on the following user preferences:
      - Career Path: ${careerPath}
      - Current Skill Level: ${currentSkillLevel}
      - Preferred Learning Style: ${preferredLearningStyle}

      Generate a personalized learning path with actionable steps, tips, milestones, and recommended resources (with titles and URLs). Return the response in this JSON format:

      {
        "steps": [
          {
            "id": 1,
            "title": "Step title",
            "description": "Step description",
            "milestone": "Step milestone",
            "tips": ["Tip 1", "Tip 2"],
            "resources": [
              { "title": "Resource Title", "url": "https://example.com" }
            ]
          }
        ]
      }
    `;


    const response = await mistral.chat.complete({
      model: "open-mistral-nemo",
      messages: [{ role: "user", content: prompt }],
    });

    const rawResponse = response.choices[0]?.message?.content;
    console.log("Raw response from Mistral:", rawResponse); // Log raw response

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response.");
    }

    const learningPath = JSON.parse(jsonMatch[0]);
    console.log("Parsed Learning Path:", learningPath);

    // Save the learning path and mark hasSavedLearningPath as true
    user.learningPath = learningPath.steps;
    user.hasSavedLearningPath = true;

    // Log before saving to ensure the data is correct
    console.log("User data before saving:", user);

    await user.save();
    res.json({ learningPath: learningPath.steps });
  } catch (error) {
    console.error("Error generating learning path:", error.message);
    res.status(500).json({ error: "Failed to generate learning path." });
  }
});

// User progress endpoint - Get user's completed steps and saved resources
app.get("/api/user/progress", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    res.json({
      completedSteps: user.completedSteps || [],
      savedResources: user.savedResources || [],
      // Also return path-specific progress for better tracking
      pathProgress: user.pathProgress || {}
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update user progress endpoint - Mark steps as complete/incomplete
app.post("/api/user/progress", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { stepId, completed, pathId } = req.body;
    
    if (stepId === undefined) {
      return res.status(400).json({ error: "Step ID is required." });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    // Initialize completedSteps array if it doesn't exist
    if (!user.completedSteps) {
      user.completedSteps = [];
    }
    
    // Initialize pathProgress object if it doesn't exist
    if (!user.pathProgress) {
      user.pathProgress = {};
    }
    
    if (completed) {
      // Add stepId to completedSteps if not already there
      if (!user.completedSteps.includes(stepId)) {
        user.completedSteps.push(stepId);
      }
      
      // Track path-specific progress
      if (pathId) {
        if (!user.pathProgress[pathId]) {
          user.pathProgress[pathId] = { completedSteps: [] };
        }
        
        // Extract the step number from the path-specific stepId (format: pathId-stepId)
        const actualStepId = stepId.replace(`${pathId}-`, '');
        
        if (!user.pathProgress[pathId].completedSteps.includes(actualStepId)) {
          user.pathProgress[pathId].completedSteps.push(actualStepId);
        }
      }
    } else {
      // Remove stepId from completedSteps
      user.completedSteps = user.completedSteps.filter(id => id !== stepId);
      
      // Remove from path-specific progress
      if (pathId && user.pathProgress[pathId]) {
        const actualStepId = stepId.replace(`${pathId}-`, '');
        user.pathProgress[pathId].completedSteps = user.pathProgress[pathId].completedSteps.filter(
          id => id !== actualStepId
        );
      }
    }
    
    await user.save();
    
    res.json({
      message: `Step ${completed ? 'marked as complete' : 'marked as incomplete'}.`,
      completedSteps: user.completedSteps,
      pathProgress: user.pathProgress
    });
  } catch (error) {
    console.error("Error updating user progress:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Save/unsave resource endpoint
app.post("/api/user/save-resource", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { resourceId, saved } = req.body;
    
    if (resourceId === undefined) {
      return res.status(400).json({ error: "Resource ID is required." });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    // Initialize savedResources array if it doesn't exist
    if (!user.savedResources) {
      user.savedResources = [];
    }
    
    if (saved) {
      // Add resourceId to savedResources if not already there
      if (!user.savedResources.includes(resourceId)) {
        user.savedResources.push(resourceId);
      }
    } else {
      // Remove resourceId from savedResources
      user.savedResources = user.savedResources.filter(id => id !== resourceId);
    }
    
    await user.save();
    
    res.json({
      message: `Resource ${saved ? 'saved' : 'unsaved'}.`,
      savedResources: user.savedResources
    });
  } catch (error) {
    console.error("Error updating saved resources:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get saved resources endpoint
app.get("/api/user/saved-resources", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user and get their saved resources
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    // Return the list of saved resource IDs
    res.json({
      savedResources: user.savedResources || []
    });
  } catch (error) {
    console.error("Error fetching saved resources:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Reset learning path endpoint
app.post("/api/reset-learning-path", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    // Reset the learning path and flag
    user.learningPath = [];
    user.hasSavedLearningPath = false;
    
    await user.save();
    res.json({ message: "Learning path reset successfully." });
  } catch (error) {
    console.error("Error resetting learning path:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update this existing endpoint
app.get("/api/user/saved-resources", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    // Get main learning path saved resources
    const mainSavedResources = (user.savedResources || []).map(id => String(id));
    
    // Get path-specific saved resources
    const pathSpecificResources = [];
    if (user.pathProgress) {
      Object.keys(user.pathProgress).forEach(pathKey => {
        const pathProgress = user.pathProgress[pathKey];
        if (pathProgress.savedResources) {
          pathSpecificResources.push(...pathProgress.savedResources);
        }
      });
    }
    
    // Combine all saved resources
    const allSavedResources = [...mainSavedResources, ...pathSpecificResources];
    
    res.json({ 
      savedResources: allSavedResources,
      mainPathResources: mainSavedResources,
      pathSpecificResources: pathSpecificResources
    });
  } catch (error) {
    console.error("Error fetching saved resources:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});



// Enhanced chatbot endpoint with context awareness and broader capabilities
app.post("/api/chatbot", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, chatId } = req.body;
    
    // Get user data if available
    const user = await User.findById(userId);
    
    // Get chat history for context if chatId is provided
    let chatHistory = [];
    let chat;
    
    if (chatId) {
      // Find existing chat
      chat = await Chat.findOne({ _id: chatId, userId });
      if (chat) {
        // Extract recent messages for context (limit to last 10 for efficiency)
        chatHistory = chat.messages.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
      }
    }
    
    // Prepare system message based on available information
    let systemMessage = `You are AssistMe, a helpful, friendly AI assistant that provides thoughtful responses.
    
Your primary strengths are in learning and career guidance, but you're capable of discussing virtually any topic.

Respond in a conversational but concise manner, using appropriate formatting:
- Use headings (starting with ##) for major sections
- Use bullet points where lists are appropriate
- Keep paragraphs brief and focused

Always aim to be helpful, accurate, and respectful.`;

    // Add user-specific context if available
    if (user && (user.name || user.careerPath || user.currentSkillLevel || user.preferredLearningStyle)) {
      systemMessage += `\n\nAdditional context about the user:`;
      
      if (user.name) systemMessage += `\n- Name: ${user.name}`;
      if (user.careerPath) systemMessage += `\n- Career Path: ${user.careerPath}`;
      if (user.currentSkillLevel) systemMessage += `\n- Current Skill Level: ${user.currentSkillLevel}`;
      if (user.preferredLearningStyle) systemMessage += `\n- Preferred Learning Style: ${user.preferredLearningStyle}`;
      if (user.shortTermGoals) systemMessage += `\n- Short-Term Goals: ${user.shortTermGoals}`;
      if (user.longTermGoals) systemMessage += `\n- Long-Term Goals: ${user.longTermGoals}`;
      
      systemMessage += `\n\nUse this information when relevant, but don't focus on it exclusively. Respond naturally to the user's query.`;
    }
    
    // Build messages array for the AI
    const messages = [
      { role: "system", content: systemMessage }
    ];
    
    // Add chat history if available
    if (chatHistory.length > 0) {
      messages.push(...chatHistory);
    }
    
    // Add the current user message
    messages.push({ role: "user", content: message });
    
    // Get response from AI (using a more capable model if available)
    const response = await mistral.chat.complete({
      model: "open-mistral-nemo", // Consider using a more advanced model if available
      messages: messages,
      temperature: 0.7, // Adds a bit more creativity to responses
      max_tokens: 1000, // Allow for more detailed responses
    });
    
    const rawBotResponse = response.choices[0]?.message?.content || "I'm not sure how to respond to that.";
    
    // Format response for better readability
    const formattedResponse = formatBotResponse(rawBotResponse);
    
    // Determine if we need to create a new chat or update existing
    if (chatId && chat) {
      // Add new messages to existing chat
      chat.messages.push(
        { sender: 'user', text: message },
        { sender: 'bot', text: formattedResponse }
      );
      chat.updatedAt = Date.now();
      
      // Generate title for the chat if it doesn't exist
      if (!chat.title) {
        const titlePrompt = `Based on this message: "${message}", generate a very short title (3-5 words max) that summarizes the main topic.`;
        try {
          const titleResponse = await mistral.chat.complete({
            model: "open-mistral-nemo",
            messages: [{ role: "user", content: titlePrompt }],
            temperature: 0.3,
            max_tokens: 20,
          });
          
          chat.title = titleResponse.choices[0]?.message?.content?.replace(/["""]/g, '').trim() || "Chat Session";
          // Ensure title is not too long
          if (chat.title.length > 30) {
            chat.title = chat.title.substring(0, 30) + "...";
          }
        } catch (error) {
          console.error("Error generating chat title:", error);
          // Fall back to default title method if AI title generation fails
          chat.title = message.substring(0, 30) + "...";
        }
      }
    } else {
      // Create new chat with both messages
      const titlePrompt = `Based on this message: "${message}", generate a very short title (3-5 words max) that summarizes the main topic.`;
      let chatTitle;
      
      try {
        const titleResponse = await mistral.chat.complete({
          model: "open-mistral-nemo",
          messages: [{ role: "user", content: titlePrompt }],
          temperature: 0.3,
          max_tokens: 20,
        });
        
        chatTitle = titleResponse.choices[0]?.message?.content?.replace(/["""]/g, '').trim() || "Chat Session";
        // Ensure title is not too long
        if (chatTitle.length > 30) {
          chatTitle = chatTitle.substring(0, 30) + "...";
        }
      } catch (error) {
        console.error("Error generating chat title:", error);
        chatTitle = message.substring(0, 30) + "...";
      }
      
      chat = new Chat({
        userId,
        title: chatTitle,
        messages: [
          { sender: 'user', text: message },
          { sender: 'bot', text: formattedResponse }
        ]
      });
    }
    
    await chat.save();
    
    // Add analytics or logging here if needed
    
    res.json({
      response: formattedResponse,
      chatId: chat._id
    });
  } catch (error) {
    console.error("Error in chatbot endpoint:", error);
    res.status(500).json({ error: "Failed to process request." });
  }
});

/**
 * Enhanced formatting for bot responses to improve readability
 * @param {string} rawResponse - The raw text response from the AI
 * @returns {string} - Formatted response with proper markdown
 */
function formatBotResponse(rawResponse) {
  if (!rawResponse) return '';
  
  // Split the response into lines
  const lines = rawResponse.split('\n');
  let formattedLines = [];
  
  // Variables to track formatting state
  let inCodeBlock = false;
  
  for (let line of lines) {
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      formattedLines.push(line);
      continue;
    }
    
    // If we're in a code block, don't modify formatting
    if (inCodeBlock) {
      formattedLines.push(line);
      continue;
    }
    
    // Trim whitespace
    line = line.trim();
    
    // Skip empty lines but preserve them
    if (!line) {
      formattedLines.push('');
      continue;
    }
    
    // Format headings
    if (line.startsWith('#')) {
      // Keep proper markdown headings as is
      formattedLines.push(line);
    } 
    // Convert "Heading:" format to markdown heading
    else if (/^[A-Z][A-Za-z\s]+:/.test(line) && !line.includes(' ') && line.endsWith(':')) {
      const heading = line.replace(':', '');
      formattedLines.push(`## ${heading}`);
    }
    // Enhance bullet points
    else if (line.startsWith('-') || line.startsWith('*')) {
      // Check if it's already well-formatted
      if (line.startsWith('- ') || line.startsWith('* ')) {
        formattedLines.push(line);
      } else {
        // Fix spacing after bullet point
        formattedLines.push(line.replace(/^(-|\*)/, '$1 '));
      }
    }
    // Format numbered lists
    else if (/^\d+\./.test(line)) {
      // Check if it's already well-formatted
      if (/^\d+\. /.test(line)) {
        formattedLines.push(line);
      } else {
        // Fix spacing after number
        formattedLines.push(line.replace(/^(\d+\.)/, '$1 '));
      }
    }
    // Add emphasis to important phrases
    else if (line.includes(':') && !line.startsWith(':')) {
      const parts = line.split(':');
      if (parts.length === 2 && parts[0].length < 30) {
        // Only format if it looks like a key-value pair
        formattedLines.push(`**${parts[0]}:** ${parts[1]}`);
      } else {
        formattedLines.push(line);
      }
    }
    // Regular text
    else {
      formattedLines.push(line);
    }
  }
  
  return formattedLines.join('\n');
}

// Route to save or update a chat
app.post("/api/chats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId, messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages must be provided as an array" });
    }
    
    let chat;
    
    // If chatId is provided, update existing chat
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId });
      
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      
      chat.messages = messages;
      chat.updatedAt = Date.now();
    } else {
      // Create a new chat
      chat = new Chat({
        userId,
        messages,
      });
    }
    
    await chat.save();
    
    res.status(200).json({ 
      success: true, 
      chat: {
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      } 
    });
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

// Route to get all chats for a user
app.get("/api/chats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all chats, sorted by most recent first
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select('_id title messages.sender messages.text createdAt updatedAt')
      .lean();
    
    const formattedChats = chats.map(chat => ({
      id: chat._id,
      title: chat.title || (chat.messages[0]?.text.substring(0, 30) + "...") || "New Chat",
      preview: chat.messages[0]?.text.substring(0, 60) + "...",
      messageCount: chat.messages.length,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    }));
    
    res.status(200).json({ chats: formattedChats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// Route to get a specific chat by ID
app.get("/api/chats/:chatId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    
    const chat = await Chat.findOne({ _id: chatId, userId })
      .select('_id title messages createdAt updatedAt')
      .lean();
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    res.status(200).json({
      chat: {
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Route to delete a chat
app.delete("/api/chats/:chatId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    
    const result = await Chat.deleteOne({ _id: chatId, userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Chat not found or already deleted" });
    }
    
    res.status(200).json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

app.post("/api/specific-path/generate", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, details } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const prompt = `
      The user wants to master the topic "${topic}".
      Details: ${details}
      Generate a personalized learning path with actionable steps, milestones, and recommended resources (title and URL).
      Return in this JSON format:
      {
        "steps": [
          {
            "id": 1,
            "title": "Step title",
            "description": "Step description",
            "milestone": "Step milestone",
            "resources": [{ "title": "Resource Title", "url": "https://example.com" }]
          }
        ]
      }
    `;

    const response = await mistral.chat.complete({
      model: "open-mistral-nemo",
      messages: [{ role: "user", content: prompt }],
    });

    const rawResponse = response.choices[0]?.message?.content;
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to extract JSON from response.");

    const learningPath = JSON.parse(jsonMatch[0]);

    // Save the specific path
    const newPath = {
      id: user.specificPaths.length + 1,
      topic,
      learningPath: learningPath.steps,
    };
    user.specificPaths.push(newPath);

    await user.save();
    res.json({ specificPath: newPath });
  } catch (error) {
    console.error("Error generating specific topic path:", error.message);
    res.status(500).json({ error: "Failed to generate the path." });
  }
});


app.get("/api/specific-paths", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ specificPaths: user.specificPaths });
  } catch (error) {
    console.error("Error fetching specific paths:", error.message);
    res.status(500).json({ error: "Failed to fetch paths." });
  }
});

app.post("/api/save-resume", authenticateToken, async (req, res) => {
  const { content, contactInfo, summary, skills, experience, education, projects } = req.body;
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const resume = await Resume.findOneAndUpdate(
      { userId: user._id },
      { content, contactInfo, summary, skills, experience, education, projects },
      { new: true, upsert: true }
    );

    return res.status(200).json({ message: "Resume saved", resume });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ error: "Failed to save resume" });
  }
});

// Improve resume section with Mistral AI
app.post('/improve-with-ai', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { current, type } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const prompt = `As an expert resume writer, improve the following ${type} description for a ${user.careerPath} professional.
Make it more impactful, quantifiable, and aligned with industry standards.
Current content: "${current}"

Requirements:
1. Use action verbs
2. Include metrics and results where possible
3. Highlight relevant technical skills
4. Keep it concise but detailed
5. Focus on achievements over responsibilities
6. Use industry-specific keywords

Format the response as a single paragraph without any additional text or explanations.`;

    const response = await mistral.chat.complete({
      model: "open-mistral-nemo",
      messages: [{ role: "user", content: prompt }],
    });

    const improvedContent = response.choices[0]?.message?.content?.trim();
    return res.json({ content: improvedContent });
  } catch (error) {
    console.error("AI improvement failed:", error);
    return res.status(500).json({ error: "Failed to improve content" });
  }
});


// Example protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route.", user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("JWT_SECRET:", JWT_SECRET);
  console.log("MONGO_URI:", MONGO_URI);
});