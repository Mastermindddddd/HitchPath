import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import { check, validationResult } from "express-validator";
import User from "./models/userModel.js";
import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
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
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

  // OpenAI API configuration
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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

      const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email }, JWT_SECRET);

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

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
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

app.post("/api/chatbot", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Prepare prompt with user data
    const prompt = `
  You are a personalized AI assistant for learning and career guidance. 
  The user has the following information:
  - Name: ${user.name}
  - Career Path: ${user.careerPath || "Not specified"}
  - Current Skill Level: ${user.currentSkillLevel}
  - Preferred Learning Style: ${user.preferredLearningStyle}
  - Short-Term Goals: ${user.shortTermGoals || "Not specified"}
  - Long-Term Goals: ${user.longTermGoals || "Not specified"}

  The user asked: "${message}".
  
  Please provide a helpful response in short, concise points with headings where appropriate. Focus on being straight to the point.
`;


    const response = await mistral.chat.complete({
      model: "open-mistral-nemo",
      messages: [{ role: "user", content: prompt }],
    });

    const rawBotResponse = response.choices[0]?.message?.content || "I'm not sure how to respond to that.";

    // Format bot response into sections with headings and bullet points
    const formattedResponse = formatBotResponse(rawBotResponse);

    res.json({ response: formattedResponse });
  } catch (error) {
    console.error("Error in chatbot endpoint:", error.message);
    res.status(500).json({ error: "Failed to process request." });
  }
});

// Utility function to format bot responses
function formatBotResponse(response) {
  // Split by new lines to identify sections
  const sections = response.split("\n").filter((line) => line.trim() !== "");
  let formatted = "";

  sections.forEach((section) => {
    if (section.startsWith("- ")) {
      // Format as a bullet point
      formatted += `\u2022 ${section.slice(2)}\n`;
    } else if (section.endsWith(":")) {
      // Format as a heading
      formatted += `\n**${section}**\n`;
    } else {
      // Add regular text
      formatted += `${section}\n`;
    }
  });

  return formatted.trim();
}

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
  console.log("OpenAI:", OPENAI_API_KEY);
});
