const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a resume name'],
    },
    originalName: {
      type: String,
      required: true,
    },
    fileData: {
      type: Buffer,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume; 