const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  category: String,
});

module.exports = mongoose.model('Vendor', vendorSchema);
