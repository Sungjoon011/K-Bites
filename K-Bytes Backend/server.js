require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); 

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