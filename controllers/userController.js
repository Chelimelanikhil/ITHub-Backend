const Company = require('../models/User');



const getuserdetails = async (req, res) => {
  const id = req.user.id;

  try {
    // Query the company using the `id` parameter
    const user = await Company.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    res.status(200).json(user.name); // Return the company data
    
  } catch (error) {
    console.error('Error fetching company details:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' }); // Return a generic server error response
  }
};

module.exports = { getuserdetails };
