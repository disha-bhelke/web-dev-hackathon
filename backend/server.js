const express = require('express');
const app = express();
const bd = require('./db');
app.use(express.json());
const cors = require("cors");


const PORT = process.env.PORT || 3000;


app.use(cors({ origin: "http://localhost:5173" }));

const vendorRoutes = require('./routes/vendorRoutes');
app.use('/api/vendor', vendorRoutes);

const supplierRoutes = require('./routes/supplierRoutes');
app.use('/api/supplier', supplierRoutes);

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});

