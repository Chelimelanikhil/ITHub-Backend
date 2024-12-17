const express = require('express');

const { getCompany, getAllCompanies, onboarding, getCompanydetails, updateabout, addJob, updateJob, deleteJob, addreview, updatereview, deletereview, addimages, deleteimages,deleteMultipleImages,updatecompanyprofilepic } = require('../controllers/companyController');
const { authenticate } = require('../middleware/authMiddleware');

// Initialize Router
const router = express.Router();


router.post('/onboarding', authenticate, onboarding)

router.get('/companydetails', authenticate, getCompanydetails);

router.put('/update-about', authenticate, updateabout);

// Route for adding a new job
router.post('/add-job', authenticate, addJob);

router.post('/update-company-profile-pic', authenticate, updatecompanyprofilepic);

// Route for updating an existing job
router.put('/update-job', authenticate, updateJob);

// Route for deleting a job
router.delete('/delete-job', authenticate, deleteJob);

// Route for adding a new review
router.post('/add-review', authenticate, addreview);

// Route for updating an existing review
router.put('/update-review', authenticate, updatereview);

router.post('/add-images/:companyId', authenticate, addimages);

router.delete('/delete-image/:companyId', authenticate, deleteimages);


router.delete('/delete-images/:companyId', authenticate, deleteMultipleImages);


// Route for deleting a review
router.delete('/delete-review', authenticate, deletereview);

router.get('/companydetails/:id', getCompany);

router.get('/allcompanies', getAllCompanies);




module.exports = router;
