const asyncHandler = require('express-async-handler');
const Resume = require('../models/resumeModel');

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
// @access  Private
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }, { fileData: 0 }); // Exclude file data for list
  res.status(200).json(resumes);
});

// @desc    Get a single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  // Check if resume belongs to user
  if (resume.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this resume');
  }

  res.status(200).json({
    _id: resume._id,
    name: resume.name,
    originalName: resume.originalName,
    fileSize: resume.fileSize,
    contentType: resume.contentType,
    uploadDate: resume.uploadDate,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
  });
});

// @desc    Download a resume
// @route   GET /api/resumes/:id/download
// @access  Private
const downloadResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  // Check if resume belongs to user
  if (resume.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this resume');
  }

  // Set response headers for PDF download
  res.set({
    'Content-Type': resume.contentType,
    'Content-Disposition': `attachment; filename="${resume.originalName}"`,
    'Content-Length': resume.fileSize,
  });

  // Send the file data
  res.send(resume.fileData);
});

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
const createResume = asyncHandler(async (req, res) => {
  try {
    // Log the request details
    console.log('Received resume upload request:', {
      body: { ...req.body, fileData: req.body.fileData ? 'base64 data present' : 'no file data' },
      user: req.user ? req.user._id : 'no user',
      headers: req.headers
    });

    // Validate user authentication
    if (!req.user || !req.user._id) {
      console.log('No authenticated user found');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { name, fileData, fileName } = req.body;

    // Validate required fields
    if (!name || !fileData || !fileName) {
      console.log('Missing required fields:', { name: !!name, fileData: !!fileData, fileName: !!fileName });
      return res.status(400).json({ message: 'Please provide name, file data, and file name' });
    }

    // Validate file type
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      console.log('Invalid file type:', fileName);
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    try {
      // Convert base64 to buffer
      const fileBuffer = Buffer.from(fileData, 'base64');
      
      // Calculate file size
      const fileSize = fileBuffer.length;
      console.log('File size:', fileSize);

      // Validate file size (5MB limit)
      if (fileSize > 5 * 1024 * 1024) {
        console.log('File too large:', fileSize);
        return res.status(400).json({ message: 'File size should be less than 5MB' });
      }

      // Create resume with file data
  const resume = await Resume.create({
    user: req.user._id,
    name,
        originalName: fileName,
        fileData: fileBuffer,
        fileSize,
        contentType: 'application/pdf',
      });

      console.log('Resume created successfully:', resume._id);

      // Return resume without file data
      return res.status(201).json({
        _id: resume._id,
        name: resume.name,
        originalName: resume.originalName,
        fileSize: resume.fileSize,
        contentType: resume.contentType,
        uploadDate: resume.uploadDate,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        message: 'Failed to create resume in database',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Error in createResume:', error);
    return res.status(500).json({ 
      message: error.message || 'Failed to create resume',
      error: error.stack
    });
  }
});

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  // Check if resume belongs to user
  if (resume.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this resume');
  }

  await resume.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getResumes,
  getResume,
  downloadResume,
  createResume,
  deleteResume,
}; 