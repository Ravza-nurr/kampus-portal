const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getNews).post(protect, admin, createNews);
router
  .route('/:slug')
  .get(getNewsBySlug)
  .put(protect, admin, updateNews)
  .delete(protect, admin, deleteNews);

module.exports = router;
