const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const cookieParser = require("cookie-parser");

// Database connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Database connection error', err);
});

app.use(cors());

// middlewares
app.use(express.json());
app.use('/', require('./routes/auth'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})