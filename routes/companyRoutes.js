const express = require('express');
const Company = require('../models/Company');

const { addCompany,getCompany,getAllCompanies ,onboarding} = require('../controllers/companyController');
const { authenticate } = require('../middleware/authMiddleware');

// Initialize Router
const router = express.Router();

// Route to add a company (requires authentication)
router.post('/add', authenticate, addCompany);

router.post('/onboarding',authenticate,onboarding)

router.get('/companydetails',authenticate, getCompany);

router.get('/allcompanies', getAllCompanies);




module.exports = router;
