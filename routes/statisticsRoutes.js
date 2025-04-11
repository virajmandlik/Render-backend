const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statisticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getStatistics);

module.exports = router; 