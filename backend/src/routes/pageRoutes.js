const express = require('express');
const router = express.Router();
const { getPages, updatePages } = require('../controllers/pageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getPages).put(protect, admin, updatePages);

module.exports = router;
