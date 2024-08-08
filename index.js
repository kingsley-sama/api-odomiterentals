#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path')
const app = express();
const productRouter = require('./routes/product')
const userRouter = require('./routes/users')
const sendMail = require('./routes/email')
app.use(express.json());
app.use(cors());
// Load environment variables from a .env file if it exists
require('dotenv').config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log('Connected successfully to MongoDB');
  } catch (e) {
    console.log('MongoDB connection error:', e);
  }
};
connect()
// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.id;
    next();
  });
}
// using the routes from the other folder
app.use('/addproducts', productRouter)
app.use('/signup', userRouter)
app
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//try outs
