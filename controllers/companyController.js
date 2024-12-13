const Company = require('../models/Company');

const getCompany = async (req, res) => {
    const { id } = req.params; // Extract 'id' from URL params

    try {
        // Query the company using the `id` parameter
        const company = await Company.findOne({ _id: id });



        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json(company); // Return the company data
    } catch (error) {
        console.error(error); // Log any errors that occur
        res.status(500).json({ message: 'Server error' }); // Return a server error
    }
};

const getCompanydetails = async (req, res) => {
    const id = req.user.id;

    try {
        // Query the company using the `id` parameter
        const company = await Company.findOne({ createdBy: id });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json(company); // Return the company data
    } catch (error) {
        console.error('Error fetching company details:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' }); // Return a generic server error response
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


        // Extract required fields from basicInfo
        const { name, email, industry, founded, address, phone, location, employees, rating, openings, image } = basicInfo;

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



const updateabout = async (req, res) => {
    const { companyId, about } = req.body;

    // Validate the request body
    if (!companyId || !about) {
        return res.status(400).json({ message: 'Company ID and About are required.' });
    }

    try {
        // Update the company record in the database
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { about }, // Set the new "about" content
            { new: true } // Return the updated document
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        res.status(200).json({
            message: 'Company about section updated successfully.'
        });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
}

const addJob = async (req, res) => {
    try {
        const company = await Company.findById(req.body.companyId);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const newJob = {
            title: req.body.title,
            description: req.body.description,
            requirements: req.body.requirements,
            location: req.body.location,
            salary: req.body.salary,
            type: req.body.type,
        };

        company.jobs.push(newJob);  // Add the new job to the company's jobs array
        await company.save();  // Save the company document with the new job

        res.status(200).json({ message: 'Job added successfully', job: newJob });
    } catch (error) {
        console.error('Error adding job:', error);
        res.status(500).json({ message: 'Error adding job. Please try again.' });
    }
};



  // Update a job within a company
const updateJob = async (req, res) => {
    try {
      const { companyId, jobId, updatedData } = req.body;

      const company = await Company.findById(companyId);

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      const job = company.jobs.id(jobId);  // Find the job by its ID

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Update the job fields with new data
      job.title = updatedData.title || job.title;
      job.description = updatedData.description || job.description;
      job.requirements = updatedData.requirements || job.requirements;
      job.location = updatedData.location || job.location;
      job.salary = updatedData.salary || job.salary;
      job.type = updatedData.type || job.type;

      await company.save();  // Save the changes to the company document

      res.status(200).json({ message: 'Job updated successfully', job });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ message: 'Error updating job. Please try again.' });
    }
  };

  const deleteJob = async (req, res) => {
    const { companyId, jobId } = req.body;
   
  
    try {
      // Find the company by ID
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      // Remove the job using the pull() method on the jobs array
      const jobIndex = company.jobs.findIndex(job => job._id.toString() === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      // Remove the job from the array
      company.jobs.splice(jobIndex, 1);
  
      // Save the company document after removing the job
      await company.save();
  
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
      console.error('Error deleting job:', err);
      res.status(500).json({ message: 'Error deleting job', error: err.message });
    }
  };


module.exports = { getCompany, getAllCompanies, onboarding, getCompanydetails, updateabout, addJob , updateJob,deleteJob};
