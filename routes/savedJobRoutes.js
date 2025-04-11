const express = require('express');
const router = express.Router();
const {
  getSavedJobs,
  saveJob,
  deleteSavedJob,
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSavedJobs)
  .post(saveJob);

router.route('/:id')
  .delete(deleteSavedJob);

module.exports = router; 