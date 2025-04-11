const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    role: {
      type: String,
      required: [true, 'Please add a job role'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    dateApplied: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
    },
    salary: {
      type: String,
    },
    link: {
      type: String,
    },
    description: {
      type: String,
    },
    notes: {
      type: String,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    contactPerson: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job; 