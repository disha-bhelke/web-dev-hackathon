const express = require('express');
const router = express.Router();
const Product = require('../models/supplier');
const axios = require('axios');

// 👉 Get coordinates from Google API
async function getCoordinatesFromAddress(address) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  
  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return [location.lng, location.lat]; // [lng, lat]
    } else {
      throw new Error("Failed to fetch coordinates");
    }
  } catch (err) {
    console.error("Google Geocoding Error:", err.message);
    return [0, 0]; // fallback coords
  }
}

// ✅ Add Product Route
router.post('/addproduct', async (req, res) => {
  try {
    const {
      productName,
      supplierName,
      supplierContact,
      supplierAddress,
      productQuantity,
      productPrice,
      deliver
    } = req.body;

    // ✅ Fetch coordinates before saving
    const coordinates = await getCoordinatesFromAddress(supplierAddress);

    const newSupplier = {
      supplierName,
      supplierContact,
      supplierAddress,
      productQuantity,
      productPrice,
      deliver,
      location: {
        type: 'Point',
        coordinates: coordinates
      }
    };

    let product = await Product.findOne({ productName });

    if (product) {
      product.supplierArray.push(newSupplier);
      await product.save();
      return res.status(200).json({ message: 'Supplier added to existing product', product });
    } else {
      const newProduct = new Product({
        productName,
        supplierArray: [newSupplier]
      });

      await newProduct.save();
      return res.status(201).json({ message: 'New product created with supplier', product: newProduct });
    }

  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
