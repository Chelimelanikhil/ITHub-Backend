const Company = require('../models/Company');

const addCompany = async (req, res) => {
    const { name, email, industry, address, phone, location, employees,founded,image, rating, openings } = req.body;
     console.log(req.body);
    try {
        // Check if company email already exists
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company email already exists' });
        }

        // Create new company
        const company = new Company({
            name,
            email,
            industry,
            address,
            phone,
            location,
            employees,
            founded,
            rating,
            openings,
            image,
            createdBy: req.user.id, // Assuming req.user.id comes from token middleware
        });

        await company.save();

        res.status(201).json({ message: 'Company added successfully', company });
    } catch (err) {
        res.status(500).json({ message: 'Error adding company', error: err.message });
    }
};

const getCompany = async (req, res) => {
    const createdBy = req.user.id; // This is the user's ID (createdBy)
    console.log(createdBy);
   

    try {
        // Query the company using the `createdBy` field
        const company = await Company.findOne({ createdBy });
        console.log(company);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find(); // Fetch all companies
        if (!companies || companies.length === 0) {
            return res.status(404).json({ message: 'No companies found' });
        }

        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const onboarding = async (req, res) => {
    try {
      const { basicInfo, about, jobs, reviews, gallery } = req.body;
      console.log(req.body); // Log to check the data
  
      // Extract required fields from basicInfo
      const { name, email, industry,founded, address, phone, location, employees, rating, openings, image } = basicInfo;
  
      // Create a new company instance with all the data
      const newCompany = new Company({
        name,
        email,
        industry,
        founded,
        address,
        phone,
        location,
        employees,
        rating,
        openings,
        image,
        createdBy: req.user.id,
        about,
        jobs,
        reviews,
        gallery
      });
  
      // Save the new company to the database
      await newCompany.save();
  
      // Send a response confirming the data has been saved
      res.status(201).json({
        message: 'Company profile saved successfully!',
        company: newCompany
      });
    } catch (error) {
      console.error('Error saving company profile:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  


module.exports = { addCompany , getCompany,getAllCompanies,onboarding};
