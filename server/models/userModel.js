const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date },
  location: { type: String },
  preferredLearningStyle: { type: String, enum: ["visual", "auditory", "reading", "kinesthetic"], default: "visual" },
  primaryLanguage: { type: String },
  preferredStudyHours: { type: String },
  paceOfLearning: { type: String, enum: ["fast", "moderate", "slow"], default: "moderate" },
  shortTermGoals: { type: String },
  longTermGoals: { type: String },
  careerPath: { type: String },
  currentSkillLevel: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  certifications: { type: String },
  focusAreas: { type: String },
  dailyAvailability: { type: String },
  preferredResourceType: { type: String },
  feedbackOnResources: { type: String },
  rewardPreferences: { type: String },
  reminderTone: { type: String },
  devicePreference: { type: String },
  accessibilityNeeds: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
