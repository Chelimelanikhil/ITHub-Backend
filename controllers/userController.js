const Company = require('../models/User');


const getuserdetails = async (req, res) => {
  const id = req.user.id;

  try {
    // Query the user using the `id` parameter, excluding the `password` field
    const user = await Company.findOne({ _id: id }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Return the user data
  } catch (error) {
    console.error('Error fetching user details:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' }); // Return a generic server error response
  }
};


module.exports = { getuserdetails };
