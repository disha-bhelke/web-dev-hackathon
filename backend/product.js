const mongoose = require('mongoose');
const { type } = require('os');
const { stringify } = require('querystring');

//supplier schema
const supplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        required: true
    },
    supplierContact: {
        type: Number,
        required: true
    },
    supplierAddress: {
        type: String,
        required: true
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

//product schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    supplierArray: [supplierSchema]
});



//create product model
const product = mongoose.model('product',productSchema);
module.exports = product;