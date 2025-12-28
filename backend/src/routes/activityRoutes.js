const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../controllers/activityController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get recent activities
router.get('/recent', protect, admin, getRecentActivities);

module.exports = router;
