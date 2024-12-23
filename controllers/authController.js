const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// Environment variables for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'sdfyuiojhgfdsfgihfxg';

// Register Controller
const register = async (req, res) => {
    console.log(req.body);
    const { name, email, password, role, profilePic } = req.body;  // Include profilePic in the request

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
        const user = new User({ name, email, password, role, profilePic });

        // Save the user to the database
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '10h' }
        );

        // Send registration confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service provider
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your password
            },
        });

        const mailOptions = {
            from: 'noreply@example.com',
            to: user.email,
            subject: 'Registration Successful',
            html: `
              <h3>Welcome to Our Platform!</h3>
              <p>Your registration was successful. You can now log in to your account.</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Include role and token in the response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            role: user.role,
            profilePic: user.profilePic, 
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
    const { resetCode, newPassword } = req.body;
    const email = req.body.email;

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
        user.password = newPassword; // Hash the new password
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error in reset password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updatePassword = async (req, res)=>{
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
   

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify old password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
  
      // Hash new password
      //const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newPassword;
  
      await user.save();
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  
}



const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user ID is attached to the request after token validation
      const { name, profilePic } = req.body;
  
      if (!name && !profilePic) {
        return res.status(400).json({ message: 'Name or profile picture must be provided.' });
      }
  
      const updatedData = {};
      if (name) updatedData.name = name;
      if (profilePic) updatedData.profilePic = profilePic;
  
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validation
      });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({
        message: 'Profile updated successfully.',
        user: {
          name: updatedUser.name,
          profilePic: updatedUser.profilePic,
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'An error occurred while updating the profile.' });
    }
  };

module.exports = { register, login, forgotPassword, resetPassword,updatePassword ,updateProfile};
