const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  industry: {
    type: String,
  },
  logo: {
    type: String,
  },
  location: {
    type: String,
  },
  size: {
    type: String,
  },
  jobCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Company', companySchema); 