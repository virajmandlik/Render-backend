const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
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
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected', 'Saved'],
    default: 'Applied',
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  url: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Check if the model exists before compiling it
module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema); 