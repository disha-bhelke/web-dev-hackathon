// server.js

const express = require('express');
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Adjust for your frontend port
app.use(express.json());

// DB connection
require('./db'); // Make sure db.js handles DB connection (like mongoose.connect)


// app.get("/", (req, res) => {
//   res.send("Welcome to the backend API!");
// });

// Routes
const vendorRoutes = require('./routes/vendorRoutes');
app.use('/api/vendor', vendorRoutes);

const supplierRoutes = require('./routes/supplierRoutes');
app.use('/api/supplier', supplierRoutes);

// Optional: Catch-all to avoid frontend 404s if using React Router and serving frontend from Express
// This is helpful ONLY IF you're also serving frontend from Express (not if frontend runs on Vite)
app.get("*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
