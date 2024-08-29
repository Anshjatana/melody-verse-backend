const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors'); 
const mongoose = require('mongoose');
const app = express();
const cookieParser = require("cookie-parser");

// Database connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Database connection error', err);
});

// middleware
app.use(express.json());
app.use('/', require('./routes/auth'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
//allow all requests from all origins & let the browser handle CORS
app.use(cors());


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})