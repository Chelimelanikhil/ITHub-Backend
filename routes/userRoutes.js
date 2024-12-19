const express = require('express');
const { getuserdetails } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware').authenticate;

const router = express.Router();

router.get('/userdetails', authenticate, getuserdetails);

module.exports = router;
