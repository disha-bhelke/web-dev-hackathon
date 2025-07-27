const express = require('express');
const router = express.Router();
const Product = require('../models/supplier'); // Adjust path if needed

// Add product route
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

        // Create supplier object from request
        const newSupplier = {
            supplierName,
            supplierContact,
            supplierAddress,
            productQuantity,
            productPrice,
            deliver
        };

        // Check if product already exists
        let product = await Product.findOne({ productName });

        if (product) {
            // Product exists, push new supplier
            product.supplierArray.push(newSupplier);
            await product.save();
            return res.status(200).json({ message: 'Supplier added to existing product', product });
        } else {
            // Create new product with supplier
            const newProduct = new Product({
                productName,
                supplierArray: [newSupplier]
            });

            await newProduct.save();
            return res.status(201).json({ message: 'New product created with supplier', product: newProduct });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getproduct', async (req, res) => {
    try {
        const products = await Product.find();

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // ✅ Format response with lat/lng instead of full address
        const response = products.map((p) => ({
            productName: p.productName,
            suppliers: p.supplierArray.map((s) => ({
                supplierName: s.supplierName,
                supplierContact: s.supplierContact,
                productQuantity: s.productQuantity,
                productPrice: s.productPrice,
                deliver: s.deliver,

                // Include both address and lat/lng
                supplierAddress: s.supplierAddress,
                latitude: s.location.coordinates[1], // [lng, lat]
                longitude: s.location.coordinates[0]
            }))
        }));

        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;