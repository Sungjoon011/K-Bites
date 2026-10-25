require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// ==========================================
// MONGODB BLUEPRINTS (Schemas)
// ==========================================
const dishSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    image: String,
    description: String,
    inStock: { type: Boolean, default: true }
});
const Dish = mongoose.model('Dish', dishSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
    items: Array,
    totalAmount: Number,
    deliveryFee: { type: Number, default: 0 },
    customerName: { type: String, default: 'Customer' }
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// API ROUTES: AUTHENTICATION
// ==========================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role: 'customer' 
        });

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '30d' }
        );

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

// ==========================================
// API ROUTES: USER MANAGEMENT (Admin)
// ==========================================
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

app.put('/api/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['customer', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User role updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user role', error: error.message });
    }
});

// ==========================================
// API ROUTES: PRODUCTS & INVENTORY
// ==========================================
app.get('/api/products', async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.json(dishes);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch dishes" });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newDish = new Dish(req.body);
        await newDish.save();
        res.status(201).json({ message: "Dish saved successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save dish" });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Dish.findByIdAndDelete(req.params.id);
        res.json({ message: "Dish deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete dish" });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedFields = req.body;
        const updatedDish = await Dish.findByIdAndUpdate(
            req.params.id, 
            updatedFields, 
            { new: true }
        );
        res.json(updatedDish);
    } catch (err) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

// Haversine formula to calculate distance between two lat/lng pairs in kilometers
function calculateDistanceInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

app.post('/api/calculate-delivery', (req, res) => {
    const { customerLat, customerLng } = req.body;

    if (!customerLat || !customerLng) {
        return res.status(400).json({ message: "Customer coordinates are required." });
    }

    const storeLat = parseFloat(process.env.STORE_LAT);
    const storeLng = parseFloat(process.env.STORE_LNG);

    const distanceKm = calculateDistanceInKm(storeLat, storeLng, parseFloat(customerLat), parseFloat(customerLng));

    // Fee structure: Base fee of ₱49 for the first 2 km, then ₱15 per extra km
    const baseFee = 49;
    const ratePerKm = 15;
    
    let deliveryFee = baseFee;
    if (distanceKm > 2) {
        deliveryFee += (distanceKm - 2) * ratePerKm;
    }

    res.json({
        distanceKm: distanceKm.toFixed(2),
        deliveryFee: Math.round(deliveryFee)
    });
});

// ==========================================
// API ROUTES: ORDERS & TRANSACTIONS
// ==========================================
app.post('/api/orders', async (req, res) => {
    try {
        const { items, totalAmount, deliveryFee, customerName } = req.body;
        const newOrder = await Order.create({ 
            items, 
            totalAmount, 
            deliveryFee: deliveryFee || 0, 
            customerName: customerName || 'Customer' 
        });
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (err) {
        res.status(500).json({ error: "Failed to place order" });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
});

// ==========================================
// PAYMONGO CHECKOUT SESSION ROUTE
// ==========================================
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, customerName, deliveryFee } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const secretKey = process.env.PAYMONGO_SECRET_KEY;
        if (!secretKey) {
            console.error("❌ ERROR: PAYMONGO_SECRET_KEY is missing from environment variables.");
            return res.status(500).json({ message: 'Server payment configuration error' });
        }

        // Map cart items into PayMongo line items
        const line_items = items.map(item => ({
            currency: 'PHP',
            amount: Math.round(item.price * 100), // Converts pesos to centavos
            name: item.name,
            quantity: item.quantity
        }));

        // Include the dynamic delivery fee as a separate line item if present
        if (deliveryFee && deliveryFee > 0) {
            line_items.push({
                currency: 'PHP',
                amount: Math.round(deliveryFee * 100),
                name: 'Delivery Fee',
                quantity: 1
            });
        }

        const options = {
            method: 'POST',
            url: 'https://api.paymongo.com/v1/checkout_sessions',
            headers: {
                accept: 'json',
                'content-type': 'application/json',
                authorization: `Basic ${Buffer.from(secretKey.trim() + ':').toString('base64')}`
            },
            data: {
                data: {
                    attributes: {
                        line_items: line_items,
                        payment_method_types: ['card', 'gcash', 'paymaya'],
                        success_url: 'http://127.0.0.1:5500/K-Bytes%20Frontend/menu-user.html?payment=success',
                        cancel_url: 'http://127.0.0.1:5500/K-Bytes%20Frontend/checkout.html?payment=cancelled',
                        description: `Food delivery order for ${customerName || 'Customer'}`,
                        send_email_receipt: true
                    }
                }
            }
        };

        const response = await axios.request(options);
        res.json({ checkoutUrl: response.data.data.attributes.checkout_url });

    } catch (error) {
        console.error('PayMongo Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to create PayMongo checkout session', error: error.response?.data || error.message });
    }
});

// ==========================================
// BOOT UP ENGINE
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));