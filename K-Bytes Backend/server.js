require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// 1. Add this import near the top with your productRoutes:
const authRoutes = require('./routes/authRoutes');

// 2. Add this activation line below app.use('/api/products', productRoutes);

const productRoutes = require('./routes/productRoutes');

// 1. Initialize app FIRST
const app = express();

// 2. NOW use app for middleware and routes
app.use(express.json()); 
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// Basic test route
app.get('/', (req, res) => {
    res.send('K-Bites Server is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));