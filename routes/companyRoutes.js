const express = require('express');

const { getCompany,getAllCompanies ,onboarding,getCompanydetails} = require('../controllers/companyController');
const { authenticate } = require('../middleware/authMiddleware');

// Initialize Router
const router = express.Router();

// Route to add a company (requires authentication)


router.post('/onboarding',authenticate,onboarding)

router.get('/companydetails', authenticate,getCompanydetails);

router.get('/companydetails/:id', getCompany);




router.get('/allcompanies', getAllCompanies);




module.exports = router;
