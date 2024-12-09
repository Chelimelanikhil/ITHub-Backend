const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'sdfyuiojhgfdsfgihfxg';

// Authentication middleware to check if the user is authenticated
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id); // Attach the user object to the request
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token', error: err.message });
    }
};

module.exports = { authenticate };
