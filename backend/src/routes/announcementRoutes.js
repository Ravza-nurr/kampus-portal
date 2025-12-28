const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  getAnnouncementBySlug,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getAnnouncements).post(protect, admin, createAnnouncement);
router
  .route('/:slug')
  .get(getAnnouncementBySlug)
  .put(protect, admin, updateAnnouncement)
  .delete(protect, admin, deleteAnnouncement);

module.exports = router;
