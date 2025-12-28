const User = require('../models/User');
const News = require('../models/News');

// @desc    Get user profile with clubs
// @route   GET /users/me/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('clubsJoined')
      .populate('clubsLeading')
      .populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user favorites
// @route   GET /users/me/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add news to favorites
// @route   POST /users/me/favorites/:newsId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const newsId = req.params.newsId;
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(newsId)) {
      return res.status(400).json({ message: 'Zaten favorilerde' });
    }

    user.favorites.push(newsId);
    await user.save();

    res.json({ message: 'Favorilere eklendi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove news from favorites
// @route   DELETE /users/me/favorites/:newsId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const newsId = req.params.newsId;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(id => id.toString() !== newsId);
    await user.save();

    res.json({ message: 'Favorilerden çıkarıldı' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  getFavorites,
  addFavorite,
  removeFavorite
};
