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
    // Hardcoded vendorId for now; ideally this should come from auth/session
    const vendorId = "68858ecfaeba95ad6cd3153b";
    const { productId, supplierId } = req.body;

    console.log("🔍 Backend /like received:", { productId, supplierId });

    // Fetch product
    const product = await Product.findById(productId);
    console.log("🔍 Product found? ", product ? product._id : null);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if supplier exists in the product's supplierArray
    const supplierIds = product.supplierArray.map(s => s._id.toString());
    console.log("🧾 Supplier IDs in product:", supplierIds);

    const supplier = product.supplierArray.find(s => s._id.toString() === supplierId);
    console.log("👀 Matched supplier:", supplier ? supplier._id.toString() : null);
    if (!supplier) return res.status(404).json({ message: "Supplier not found in product" });

    // Fetch vendor
    const vendor = await Vendor.findById(vendorId);
    console.log("🔍 Vendor found? ", vendor ? vendor._id : null);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Check if already liked
    const alreadyLiked = vendor.likedSuppliers.some(item =>
      item.productId.toString() === productId && item.supplierId.toString() === supplierId
    );
    console.log("✅ Already liked?", alreadyLiked);

    if (alreadyLiked) {
      return res.json({ message: "Already liked this supplier", likedSuppliers: vendor.likedSuppliers });
    }

    // Like the supplier
    vendor.likedSuppliers.push({ productId, supplierId });
    await vendor.save();

    console.log("✅ Supplier liked, saved.");
    res.json({ message: "Supplier liked successfully", likedSuppliers: vendor.likedSuppliers });
  } catch (err) {
    console.error("❌ Error in /like:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});




/* 🔹 GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  const products = await Product.find();
  const response = products.map((p) => ({
    productName: p.productName,
    suppliers: p.supplierArray,
  }));
  res.status(200).json(response);
});


/* 🔹 SEARCH PRODUCT & SORT SUPPLIERS BY DISTANCE */
// Sample backend /search handler
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const hardcodedVendorId = "68858ecfaeba95ad6cd3153b";
    const vendor = await Vendor.findById(hardcodedVendorId);

    if (
      !vendor ||
      !vendor.location ||
      !Array.isArray(vendor.location.coordinates) ||
      vendor.location.coordinates.length !== 2
    ) {
      return res.status(404).json({ message: "Vendor location not found" });
    }

    const [vendorLng, vendorLat] = vendor.location.coordinates;

    const product = await Product.findOne({ productName: new RegExp(q, "i") });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 👉 Safely map supplier data with distance (but preserve IDs!)
    const suppliers = product.supplierArray.map((supplier) => {
      let distance = null;

      if (
        supplier.location &&
        Array.isArray(supplier.location.coordinates) &&
        supplier.location.coordinates.length === 2
      ) {
        const [supplierLng, supplierLat] = supplier.location.coordinates;
        distance = calculateDistance(vendorLat, vendorLng, supplierLat, supplierLng);
      }

      return {
        _id: supplier._id,
        supplierName: supplier.supplierName,
        supplierContact: supplier.supplierContact,
        supplierAddress: supplier.supplierAddress,
        productQuantity: supplier.productQuantity,
        productPrice: supplier.productPrice,
        deliver: supplier.deliver,
        location: supplier.location,
        distance: distance,
      };
    });

    // Optional: sort suppliers by distance
    const sortedSuppliers = suppliers.sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });

    res.json({
      productId: product._id,
      productName: product.productName,
      suppliers: sortedSuppliers,
    });

  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});





/* 🔹 GET LIKED SUPPLIERS */
router.get("/liked", async (req, res) => {
  try {
    const vendorId = "68858ecfaeba95ad6cd3153b";
    // const { vendorId } = req.query;
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
