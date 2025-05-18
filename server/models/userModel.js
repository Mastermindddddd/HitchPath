const mongoose = require("mongoose");

// Define the schema for resources
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }
});

// Define the schema for learning path steps
const stepSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true }, // Allow both Number and String IDs
  title: { type: String, required: true },
  description: { type: String, required: true },
  milestone: { type: String, required: true },
  tips: { type: [String], default: [] },
  resources: { type: [resourceSchema], default: [] }
});

// Schema for specific learning paths (e.g., topic-specific paths)
const specificPathSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  topic: { type: String, required: true },
  learningPath: { type: [stepSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Main user schema
const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Consider making this required: true for security
  isAdmin: { type: Boolean, default: false },
  
  // Learning preferences
  preferredLearningStyle: { 
    type: String, 
    enum: ["visual", "auditory", "reading", "kinesthetic"], 
    default: "visual" 
  },
  primaryLanguage: { type: String },
  paceOfLearning: { 
    type: String, 
    enum: ["fast", "moderate", "slow"], 
    default: "moderate" 
  },
  
  // Career and skill information
  desiredSkill: { type: String }, // Note: capitalization fixed (was "DesiredSkill")
  careerPath: { type: String },
  currentSkillLevel: { 
    type: String, 
    enum: ["beginner", "intermediate", "advanced"], 
    default: "beginner" 
  },
  
  // Learning paths
  learningPath: { type: [stepSchema], default: [] },
  specificPaths: { type: [specificPathSchema], default: [] },
  hasSavedLearningPath: { type: Boolean, default: false },
  
  // Progress tracking
  completedSteps: { 
    type: [mongoose.Schema.Types.Mixed], 
    default: [] 
  },
  
  // Saved resources (format: "stepId-resourceIndex")
  savedResources: { 
    type: [String], 
    default: [] 
  },
  

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;