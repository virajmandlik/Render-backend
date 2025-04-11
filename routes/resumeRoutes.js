const express = require('express');
const router = express.Router();
const {
  getResumes,
  getResume,
  downloadResume,
  createResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Add OPTIONS handler for CORS preflight
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// All resume routes are protected
router.use(protect);

router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResume)
  .delete(deleteResume);

// Add route for downloading resume
router.route('/:id/download')
  .get(downloadResume);

module.exports = router; 