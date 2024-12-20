const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); 
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
            { expiresIn: '10h' }
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
            { expiresIn: '10h' }
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




const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email.' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

        await user.save();

        // Send reset link via email
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your email service provider
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your password
            },
        });

        const mailOptions = {
            from: 'noreply@example.com',
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetUrl}">Reset Password</a>
                   <p>This link will expire in 10 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending password reset email.' });
    }
};


const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hash the token to match the stored hashed token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by token and check token validity
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Update the password and clear the reset token fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
};

module.exports = { register, login,forgotPassword ,resetPassword};
