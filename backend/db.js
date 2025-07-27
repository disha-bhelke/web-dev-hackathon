const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL,{
    useNewUrlParser : true,
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connection established with the Database");
});

db.on('error',(err)=>{
    console.log("MongoDB connection error :",err);
});

db.on('disconnected',()=>{
    console.log("Disconnected the Database");
})

module.exports = db;