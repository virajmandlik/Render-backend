const SavedJob = require('../models/SavedJob');

// @desc    Get all saved jobs
// @route   GET /api/saved-jobs
// @access  Private
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user.id });
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Save a job
// @route   POST /api/saved-jobs
// @access  Private
const saveJob = async (req, res) => {
  try {
    const existingJob = await SavedJob.findOne({
      url: req.body.url,
      user: req.user.id,
    });

    if (existingJob) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = new SavedJob({
      ...req.body,
      user: req.user.id,
    });
    
    const newSavedJob = await savedJob.save();
    res.status(201).json(newSavedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete saved job
// @route   DELETE /api/saved-jobs/:id
// @access  Private
const deleteSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    
    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSavedJobs,
  saveJob,
  deleteSavedJob,
}; 