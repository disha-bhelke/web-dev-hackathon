const mongoose = require("mongoose");
const axios = require("axios");

// ✅ Function to get coordinates
async function getCoordinatesFromAddress(address) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return [location.lng, location.lat]; // GeoJSON format
    } else {
      console.error("Google API Error:", response.data.status);
      return [];
    }
  } catch (error) {
    console.error("Axios Error:", error.message);
    return [];
  }
}

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_no: { type: String, required: true },
  email: { type: String },
  pass: { type: String, required: true },

  // ✅ Vendor Address
  vendorAddress: { type: String, required: true },

  // ✅ Vendor Location (GeoJSON)
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },

  likedSuppliers: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ]
});

// ✅ Pre-save hook to auto-fetch coordinates
vendorSchema.pre("save", async function (next) {
  if (this.isModified("vendorAddress")) {
    try {
      const coords = await getCoordinatesFromAddress(this.vendorAddress);
      this.location = { type: "Point", coordinates: coords };
    } catch (err) {
      console.error("Geocoding Error:", err.message);
    }
  }
  next();
});

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
