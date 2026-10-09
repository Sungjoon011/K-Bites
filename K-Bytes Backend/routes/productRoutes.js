const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');

// Open routes for the mockup presentation
router.get('/', getProducts);
router.post('/', createProduct);

module.exports = router;