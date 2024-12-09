const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    location: { type: String },
    salary: { type: Number },
    postedAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    postedAt: { type: Date, default: Date.now }
});

const galleryImageSchema = new mongoose.Schema({
    url: { type: String, required: true }
});
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
      title: String,
      description: String,
      requirements: String,
      location: String,
      salary: Number,
    }],
    reviews: [{
      author: String,
      text: String,
      rating: Number,
    }],
    gallery: [{
      url: String,
    }]
  });
  
module.exports = mongoose.model('Company', companySchema);
