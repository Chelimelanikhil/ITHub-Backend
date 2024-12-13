const express = require('express');

const { getCompany,getAllCompanies ,onboarding,getCompanydetails,updateabout,addJob,updateJob,deleteJob} = require('../controllers/companyController');
const { authenticate } = require('../middleware/authMiddleware');

// Initialize Router
const router = express.Router();

// Route to add a company (requires authentication)


router.post('/onboarding',authenticate,onboarding)

router.get('/companydetails', authenticate,getCompanydetails);

router.put('/update-about',authenticate,updateabout);

// Route for adding a new job
router.post('/add-job', authenticate, addJob);

// Route for updating an existing job
router.put('/update-job', authenticate, updateJob);

// Route for deleting a job
router.delete('/delete-job', authenticate, deleteJob);



router.get('/companydetails/:id', getCompany);

router.get('/allcompanies', getAllCompanies);




module.exports = router;
