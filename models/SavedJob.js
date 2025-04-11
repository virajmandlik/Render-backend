const mongoose = require('mongoose');

const savedJobSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  salary: {
    type: String,
  },
  jobType: {
    type: String,
  },
  url: {
    type: String,
  },
  source: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SavedJob', savedJobSchema); 