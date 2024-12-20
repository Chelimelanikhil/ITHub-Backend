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
    console.log(company);
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

// const onboarding = async (req, res) => {
//   try {
//     const { basicInfo, about, jobs, reviews, gallery } = req.body;


//     // Extract required fields from basicInfo
//     const { name, email, industry, founded, address, phone, location, employees, rating, openings, image } = basicInfo;

//     // Create a new company instance with all the data
//     const newCompany = new Company({
//       name,
//       email,
//       industry,
//       founded,
//       address,
//       phone,
//       location,
//       employees,
//       rating,
//       openings,
//       image,
//       createdBy: req.user.id,
//       about,
//       jobs,
//       reviews,
//       gallery
//     });

//     // Save the new company to the database
//     await newCompany.save();

//     // Send a response confirming the data has been saved
//     res.status(201).json({
//       message: 'Company profile saved successfully!',
//       company: newCompany
//     });
//   } catch (error) {
//     console.error('Error saving company profile:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

// const onboarding = async (req, res) => {
//   try {
//     // Destructure the request body
//     const { 
//       basicInfo, 
//       about, 
//       jobs, 
//       reviews, 
//       gallery,
//       socialLinks,
//       certifications,
//       website,
//       description,
//       headquarters
//     } = req.body;

//     // Validate basic required fields
//     if (!basicInfo || !basicInfo.name || !basicInfo.email || !basicInfo.industry) {
//       return res.status(400).json({ 
//         message: 'Missing required fields',
//         requiredFields: ['name', 'email', 'industry']
//       });
//     }

//     // Extract fields from basicInfo
//     const { 
//       name, 
//       email, 
//       industry, 
//       foundedYear, 
//       address, 
//       phone, 
//       location, 
//       employees, 
//       rating, 
//       openings, 
//       logo
//     } = basicInfo;
//     console.log(basicInfo);

//     // Validate email format
//     const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ 
//         message: 'Invalid email format',
//         example: 'example@domain.com'
//       });
//     }

//     // Check if a company with this email already exists
//     const existingCompany = await Company.findOne({ email });
//     if (existingCompany) {
//       return res.status(409).json({ 
//         message: 'A company with this email already exists'
//       });
//     }

//     // Validate jobs if provided
//     if (jobs && jobs.length > 0) {
//       const validJobTypes = ['Part-Time', 'Full-Time', 'Internship', 'Contract'];
//       const invalidJobs = jobs.filter(job => 
//         !job.title || 
//         !job.description || 
//         !job.requirements || 
//         !job.location || 
//         job.salary === undefined ||
//         !validJobTypes.includes(job.type)
//       );

//       if (invalidJobs.length > 0) {
//         return res.status(400).json({ 
//           message: 'Invalid job entries',
//           invalidJobs
//         });
//       }
//     }

//     // Create a new company instance with all the data
//     const newCompany = new Company({
//       // Basic Info
//       name,
//       email,
//       industry,
//       foundedYear,
//       address,
//       phone,
//       location,
//       employees,
//       rating,
//       openings,
//       logo,
      
//       // Additional Fields
//       createdBy: req.user.id,
//       about,
//       description,
//       headquarters,
//       website,
      
//       // Optional Fields
//       socialLinks: socialLinks || {},
//       certifications: certifications || [],
      
//       // Nested Documents
//       jobs: jobs || [],
//       reviews: reviews || [],
//       gallery: gallery || []
//     });

//     // Save the new company to the database
//     const savedCompany = await newCompany.save();

//     // Send a response confirming the data has been saved
//     res.status(201).json({
//       message: 'Company profile created successfully!',
//       company: {
//         id: savedCompany._id,
//         name: savedCompany.name,
//         email: savedCompany.email,
//         industry: savedCompany.industry
//       }
//     });
//   } catch (error) {
//     console.error('Error saving company profile:', error);

//     // Handle specific Mongoose validation errors
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => ({
//         field: err.path,
//         message: err.message
//       }));

//       return res.status(400).json({ 
//         message: 'Validation Error',
//         errors: validationErrors 
//       });
//     }

//     // Generic server error
//     res.status(500).json({ 
//       message: 'Internal Server Error', 
//       error: error.message 
//     });
//   }
// };


const onboarding = async (req, res) => {
 
 
  try {
    // Destructure the request body
    const { 
      basicInfo, 
      about, 
      jobs, 
      reviews, 
      gallery
    } = req.body;

    // Validate basic required fields
    if (!basicInfo || !basicInfo.name || !basicInfo.email || !basicInfo.industry) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        requiredFields: ['name', 'email', 'industry']
      });
    }

    // Extract fields from basicInfo with destructuring and added default values
    const { 
      name, 
      email, 
      industry, 
      founded: foundedYear, 
      location, 
      employees, 
      rating, 
      openings, 
      logo,
      phone,
      headquarters,
      website,
      description,
      socialLinks = {},
      certifications = []
    } = basicInfo;

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        example: 'example@domain.com'
      });
    }

    // Check if a company with this email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(409).json({ 
        message: 'A company with this email already exists'
      });
    }

    // Validate jobs if provided
    if (jobs && jobs.length > 0) {
      const validJobTypes = ['Part-Time', 'Full-Time', 'Internship', 'Contract'];
      const invalidJobs = jobs.filter(job => 
        !job.title || 
        !job.description || 
        !job.requirements || 
        !job.location || 
        job.salary === undefined ||
        !validJobTypes.includes(job.type)
      );

      if (invalidJobs.length > 0) {
        return res.status(400).json({ 
          message: 'Invalid job entries',
          invalidJobs
        });
      }
    }

    // Create a new company instance with all the data
    const newCompany = new Company({
      // Basic Info
      name,
      email,
      industry,
      foundedYear,
      location,
      employees,
      rating,
      openings,
      logo,
      phone,
      
      // Additional Fields
      createdBy: req.user.id,
      about,
      description,
      headquarters,
      website,
      
      // Optional Fields
      socialLinks,
      certifications,
      
      // Nested Documents
      jobs: jobs || [],
      reviews: reviews || [],
      gallery: gallery || []
    });

    // Save the new company to the database
    const savedCompany = await newCompany.save();

    // Send a response confirming the data has been saved
    res.status(201).json({
      message: 'Company profile created successfully!',
      company: {
        id: savedCompany._id,
        name: savedCompany.name,
        email: savedCompany.email,
        industry: savedCompany.industry
      }
    });
  } catch (error) {
    console.error('Error saving company profile:', error);

    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({ 
        message: 'Validation Error',
        errors: validationErrors 
      });
    }

    // Generic server error
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
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

const addreview = async (req, res) => {
  try {
    const { companyId, author, designation, text, rating } = req.body;
   

    // Ensure the rating is between 0 and 5
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 0 and 5' });
    }

    // Find the company by ID
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Create the new review object
    const newReview = {
      author,
      designation, // Include designation
      text,
      rating,
      date: Date.now(), // Set current date
    };

    // Push the new review into the reviews array
    company.reviews.push(newReview);

    // Save the updated company document
    await company.save();

    // Return success response
    res.status(200).json({ msg: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


const updatereview = async (req, res) => {
  try {

    const { companyId, reviewId, author, text, rating } = req.body;

    // Ensure the rating is between 0 and 5
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 0 and 5' });
    }

    // Find the company by ID
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Find the review by ID (assuming reviewId is the index or unique identifier)
    const reviewIndex = company.reviews.findIndex(review => review._id.toString() === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Update the review fields
    company.reviews[reviewIndex].author = author || company.reviews[reviewIndex].author;
    company.reviews[reviewIndex].text = text || company.reviews[reviewIndex].text;
    company.reviews[reviewIndex].rating = rating || company.reviews[reviewIndex].rating;

    // Save the updated company document
    await company.save();

    // Return success response
    res.status(200).json({ msg: 'Review updated successfully', review: company.reviews[reviewIndex] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const deletereview = async (req, res) => {
  try {
    const { companyId, reviewId } = req.body;

    // Find the company by ID
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Find the index of the review in the reviews array
    const reviewIndex = company.reviews.findIndex(review => review._id.toString() === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Remove the review from the reviews array
    company.reviews.splice(reviewIndex, 1);

    // Save the updated company document
    await company.save();

    // Return success response
    res.status(200).json({ msg: 'Review deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};



const addimages = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { imageUrls } = req.body; // Ensure this matches client-side payload key

    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({ message: 'Invalid image URLs' });
    }

    // Find the company by ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Add new image URLs to the company's gallery
    company.gallery.push(...imageUrls.map(url => ({ url })));

    // Save the updated company document
    await company.save();

    res.status(200).json({ message: 'Images added successfully', gallery: company.gallery });
  } catch (error) {
    console.error('Error adding images:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteimages = async (req, res) => {
  const { companyId } = req.params; // Get companyId from the URL
  const { imageId } = req.body; // Get imageId from the request body


  if (!imageId) {
    return res.status(400).json({ message: 'Image ID is required' });
  }

  try {
    // Find the company by companyId
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Find the image in the gallery using imageId
    const imageIndex = company.gallery.findIndex(image => image._id.toString() === imageId);

    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Remove the image from the gallery
    company.gallery.splice(imageIndex, 1);

    // Save the updated gallery to the database
    await company.save();

    res.status(200).json({ message: 'Image deleted successfully', updatedGallery: company.gallery });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error. Failed to delete image.' });
  }
}

const deleteMultipleImages = async (req, res) => {
  const { companyId } = req.params; // Get companyId from the URL
  const { imageIds } = req.body; // Array of image IDs from the request body

  if (!Array.isArray(imageIds) || imageIds.length === 0) {
    return res.status(400).json({ message: 'An array of image IDs is required' });
  }

  try {
    // Find the company by companyId
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Filter out the images that are in the provided imageIds array
    const originalGalleryLength = company.gallery.length;
    company.gallery = company.gallery.filter(
      (image) => !imageIds.includes(image._id.toString())
    );

    // Check if any images were removed
    if (company.gallery.length === originalGalleryLength) {
      return res.status(404).json({ message: 'No matching images found for deletion' });
    }

    // Save the updated gallery to the database
    await company.save();

    res.status(200).json({
      message: 'Images deleted successfully',
      updatedGallery: company.gallery,
    });
  } catch (error) {
    console.error('Error deleting images:', error);
    res.status(500).json({ message: 'Server error. Failed to delete images.' });
  }
};




const updatecompanyprofilepic = async (req, res) => {
  try {
    const { companyId, image } = req.body; 
   

    // Validate inputs
    if (!companyId || !image) {
      return res.status(400).json({ message: 'Company ID and image are required.' });
    }

    // Find the company in the database
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    // Update the company profile with the new image
    company.image = image;

    // Save the updated company object
    await company.save();

    // Send the updated company data as a response
    res.status(200).json({ message: 'Profile image updated successfully!' });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}


module.exports = { getCompany, getAllCompanies, onboarding, getCompanydetails, updateabout, addJob, updateJob, deleteJob, addreview, updatereview, deletereview, addimages, deleteimages,deleteMultipleImages,updatecompanyprofilepic };
