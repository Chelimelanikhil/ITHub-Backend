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

        const resetCode = Math.floor(10000 + Math.random() * 90000).toString();

        // Save the reset code and expiration time (5 minutes from now)
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();
       

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
            subject: 'Password Reset Code',
            html: `
              <h3>Password Reset Request</h3>
              <p>Your password reset code is: <strong>${resetCode}</strong></p>
              <p>This code will expire in 5 minutes.</p>
            `,
          };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending password reset email.' });
    }
};


const resetPassword = async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({ message: 'Email, code, and new password are required' });
  }

  try {
    // Find the user by email and verify the reset code
    const user = await User.findOne({
      email,
      resetPasswordCode: resetCode,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Update the user's password
    user.password = bcrypt.hashSync(newPassword, 10); // Hash the new password
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { register, login, forgotPassword, resetPassword };
