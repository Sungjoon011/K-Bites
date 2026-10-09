const Product = require('../models/Product');

// Fetch all products
// Fetch all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.log("❌ Database Error:", error); // This forces the error into your terminal
        res.status(500).json({ message: 'Server Error fetching products', error: error.message });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create product', error });
    }
};

module.exports = { getProducts, createProduct };