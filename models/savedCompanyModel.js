const mongoose = require('mongoose');

const savedCompanySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  companyId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyLogo: {
    type: String,
    required: true
  },
   companyLocation: {
    type: String,
    required: true
  },
  companyEmployees: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

savedCompanySchema.index({ userId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('SavedCompany', savedCompanySchema);