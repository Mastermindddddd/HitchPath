// models/Resume.js
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  content: { type: Object }, // or Schema.Types.Mixed
});

module.exports = mongoose.model("Resume", resumeSchema);
