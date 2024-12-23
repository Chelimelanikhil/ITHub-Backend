const express = require('express');
const { register, login , forgotPassword,resetPassword,updatePassword} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');


const router = express.Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password', resetPassword);

router.post('/profile/reset-password',authenticate, updatePassword);

module.exports = router;
