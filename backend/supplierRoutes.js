const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Adjust path if needed

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

router.get('/getproduct/:productName', async (req, res) => {
    try {
        const { productName } = req.params;

        // Find product by name
        const product = await Product.findOne({ productName });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return array of suppliers
        res.status(200).json({
            productName: product.productName,
            suppliers: product.supplierArray
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
