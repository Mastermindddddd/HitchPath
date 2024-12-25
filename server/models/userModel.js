const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  milestone: { type: String, required: true },
  tips: { type: [String], default: [] },
  resources: [{ title: String, url: String }],
});

const specificPathSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  topic: { type: String, required: true },
  learningPath: { type: [stepSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});;


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date },
  preferredLearningStyle: { type: String, enum: ["visual", "auditory", "reading", "kinesthetic"], default: "visual" },
  primaryLanguage: { type: String },
  paceOfLearning: { type: String, enum: ["fast", "moderate", "slow"], default: "moderate" },
  DesiredSkill: { type: String },
  careerPath: { type: String },
  currentSkillLevel: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  learningPath: { type: [stepSchema], default: [] },  // Save the learning path here
  specificPaths: { type: [specificPathSchema], default: [] },
  hasSavedLearningPath: { type: Boolean, default: false }, // Track if user has a saved path
});

const User = mongoose.model("User", userSchema);

module.exports = User;
