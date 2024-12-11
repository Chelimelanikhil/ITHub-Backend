const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    industry: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    location: { type: String },
    founded: { type: String },
    employees: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    openings: { type: Number, default: 0 },
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    about: { type: String },
    jobs: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        requirements: { type: String, required: true },
        location: { type: String, required: true },
        salary: { type: Number, required: true },
        type: {
          type: String,
          enum: ['Part-Time', 'Full-Time'], // Allowed values
          required: true,
        },
        date: { type: Date, default: Date.now }, // New date field with default value
      }],
      reviews: [{
        author: { type: String, required: true },
        text: { type: String, required: true },
        rating: { type: Number, min: 0, max: 5, required: true },
        date: { type: Date, default: Date.now }, // New date field with default value
      }],
    gallery: [{
      url: String,
    }]
  });
  
module.exports = mongoose.model('Company', companySchema);
