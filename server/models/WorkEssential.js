const mongoose = require('mongoose');
const WorkEssentialSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  brand: String,
  category: String,
  isAffiliate: Boolean,
  affiliatelink: String
});
module.exports = mongoose.model('WorkEssential', WorkEssentialSchema);