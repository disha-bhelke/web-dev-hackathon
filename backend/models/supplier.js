const mongoose = require('mongoose');
const { type } = require('os');
const { stringify } = require('querystring');
const axios = require("axios");
require("dotenv").config();


async function getCoordinatesFromAddress(address) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    console.log("🔍 Geocoding API Raw Response:", response.data); 

    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return [location.lng, location.lat]; // [lng, lat]
    } else {
      console.error("❌ Google API Error:", response.data.status, response.data.error_message || "");
      throw new Error(`Google API Error: ${response.data.status}`);
    }
  } catch (error) {
    console.error("⚠️ Axios Request Failed:", error.message);
    throw error;
  }
}

//supplier schema
const supplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        required: true
    },
    supplierContact: {
        type: String,
        required: true
    },
    supplierAddress: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    deliver:{
        type:Boolean,
        required:true
    },
},{timestamp:true});

//Pre-save Hook
supplierSchema.pre("save", async function (next) {
  if (this.isModified("supplierAddress")) {
    try {
      const coords = await getCoordinatesFromAddress(this.supplierAddress);
      this.location = { type: "Point", coordinates: coords };
    } catch (err) {
      console.error("Geocoding Error:", err);
    }
  }
  next();
});

//product schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    supplierArray: [supplierSchema]
});



//create product model
const Product = mongoose.model('product',productSchema);
module.exports = Product;