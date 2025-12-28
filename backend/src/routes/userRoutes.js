const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getFavorites,
  addFavorite,
  removeFavorite
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me/profile', protect, getUserProfile);
router.get('/me/favorites', protect, getFavorites);
router.post('/me/favorites/:newsId', protect, addFavorite);
router.delete('/me/favorites/:newsId', protect, removeFavorite);

module.exports = router;
