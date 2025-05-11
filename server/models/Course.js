const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    image: String, // URL to thumbnail
    price: Number, // if it's paid
    rating: Number,
    type: String,
    level:{ type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    isAffiliate: { type: Boolean, default: false },
    affiliatelink: { type: String, required: true }, // external or internal course link
    category: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
