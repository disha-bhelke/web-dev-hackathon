const express = require("express");
const router = express.Router();
const Vendor = require("./../models/vendor");
const Product = require("./../models/supplier");
const Fuse = require("fuse.js");

// ✅ Function to calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
}

/* 🔹 CREATE VENDOR */
router.post("/", async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    const savedVendor = await newVendor.save();

    res.status(200).json(savedVendor);
  } catch (err) {
    console.error("❌ Vendor Creation Error:", err);
    res.status(500).json({ error: "Vendor signup failed. Try again." });
  }
});

/* 🔹 LIKE A SUPPLIER */
router.post("/like", async (req, res) => {
  try {
    const { vendorId, productId, supplierId } = req.body;
    if (!vendorId || !productId || !supplierId) {
      return res.status(400).json({ message: "vendorId, productId, supplierId are required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const supplier = product.supplierArray.id(supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const alreadyLiked = vendor.likedSuppliers.some(
      (item) => item.productId.toString() === productId && item.supplierId.toString() === supplierId
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked this supplier" });
    }

    vendor.likedSuppliers.push({ productId, supplierId });
    await vendor.save();

    res.json({ message: "Supplier liked successfully", likedSuppliers: vendor.likedSuppliers });
  } catch (err) {
    console.error("❌ Error in /like:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/* 🔹 GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const response = products.map((p) => ({
      productName: p.productName,
      suppliers: p.supplierArray,
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error("❌ Error in /:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* 🔹 SEARCH PRODUCT & SORT SUPPLIERS BY DISTANCE */
router.get("/search", async (req, res) => {
  try {
    const { q, vendorId } = req.query;

    if (!q) return res.status(400).json({ message: "Search query required" });
    if (!vendorId) return res.status(400).json({ message: "vendorId is required" });

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const allProducts = await Product.find();

    const fuse = new Fuse(allProducts, {
      keys: ["productName"],
      threshold: 0.6,
    });

    const result = fuse.search(q);
    if (result.length === 0) return res.status(404).json({ message: "Product not found" });

    const product = result[0].item;

    const vendorLat = vendor.location.coordinates[1];
    const vendorLng = vendor.location.coordinates[0];

    const suppliersWithDistance = product.supplierArray.map((s) => {
      const lat = s.location?.coordinates?.[1];
      const lng = s.location?.coordinates?.[0];

      return {
        supplierId: s._id,
        supplierName: s.supplierName,
        supplierContact: s.supplierContact,
        productPrice: s.productPrice,
        productQuantity: s.productQuantity,
        supplierAddress: s.supplierAddress,
        latitude: lat,
        longitude: lng,
        distance: lat && lng ? calculateDistance(vendorLat, vendorLng, lat, lng) : null,
      };
    });

    suppliersWithDistance.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    res.json({
      productName: product.productName,
      vendorLocation: { lat: vendorLat, lng: vendorLng },
      suppliers: suppliersWithDistance,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


/* 🔹 GET LIKED SUPPLIERS */
router.get("/liked", async (req, res) => {
  try {
    const { vendorId } = req.query;
    if (!vendorId) return res.status(400).json({ message: "vendorId is required" });

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const likedData = [];

    for (const item of vendor.likedSuppliers) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const supplier = product.supplierArray.id(item.supplierId);
      if (!supplier) continue;

      likedData.push({
        productId: product._id,
        productName: product.productName,
        supplierId: supplier._id,
        supplierName: supplier.supplierName,
        supplierContact: supplier.supplierContact,
        productPrice: supplier.productPrice,
        productQuantity: supplier.productQuantity,
      });
    }

    res.json({ likedSuppliers: likedData });
  } catch (err) {
    console.error("❌ Error in /liked:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
