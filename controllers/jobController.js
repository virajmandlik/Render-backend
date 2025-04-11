const asyncHandler = require('express-async-handler');
const Job = require('../models/jobModel');
const Resume = require('../models/resumeModel');

// @desc    Get all jobs for logged in user
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ user: req.user._id })
    .populate('resume', 'name originalName')
    .sort({ createdAt: -1 });
  res.status(200).json(jobs);
});

// @desc    Get a single job
// @route   GET /api/jobs/:id
// @access  Private
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if job belongs to user
  if (job.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this job');
  }

  res.status(200).json(job);
});

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
const createJob = asyncHandler(async (req, res) => {
  const {
    company,
    role,
    status,
    dateApplied,
    link,
    description,
    notes,
    location,
    salary,
    resumeId,
  } = req.body;

  if (!company || !role || !status || !dateApplied) {
    res.status(400);
    throw new Error('Please provide company, role, status, and date applied');
  }

  // Validate resume if provided
  if (resumeId) {
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      res.status(400);
      throw new Error('Selected resume not found');
    }
    if (resume.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to use this resume');
    }
  }

  const job = await Job.create({
    user: req.user._id,
    company,
    role,
    status,
    dateApplied,
    link,
    description,
    notes,
    location,
    salary,
    resume: resumeId,
  });

  // Populate resume data in the response
  const populatedJob = await Job.findById(job._id).populate('resume', 'name originalName');

  res.status(201).json(populatedJob);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if job belongs to user
  if (job.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this job');
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedJob);
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if job belongs to user
  if (job.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this job');
  }

  await job.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
}; 