// models/Resume.js
const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  userId: String,
  contactInfo: {
    email: String,
    mobile: String,
    linkedin: String,
    twitter: String,
    portfolio: String,
    location: String        
  },
  summary: String,
  skills: String,
  experience: [Object],
  education: [Object],
  projects: [Object],
  certifications: [Object],
  content: String
});


module.exports = mongoose.model("Resume", ResumeSchema);
