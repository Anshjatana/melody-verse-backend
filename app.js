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

// CORS Configuration
const allowedOrigins = [
    'https://melodyverse-ansh.netlify.app',
    'https://melodyverse.anshjatana.online'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Check if the origin is in the list of allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  

// middlewares
app.use(express.json());
// Handle preflight OPTIONS request
app.options('*', cors());
app.use('/', require('./routes/auth'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})