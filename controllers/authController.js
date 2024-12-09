const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Environment variables for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'sdfyuiojhgfdsfgihfxg';

// Register Controller
const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Validate role
        if (!['user', 'company'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be "user" or "company".' });
        }

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create new user
        const user = new User({ name, email, password, role });
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Include role in the response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            role: user.role, // Return role for UI purposes
        });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        // Check if user exists
        const user = await User.findOne({ email });
     
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Include role in the response
        res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role, // Return role for UI purposes
        });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

module.exports = { register, login };
