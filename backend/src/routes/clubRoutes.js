const express = require('express');
const router = express.Router();
const {
  createClub,
  updateClub,
  deleteClub,
  getClubs,
  getClubById,
  requestJoinClub,
  getClubRequests,
  approveRequest,
  rejectRequest,
  addEvent,
  deleteEvent,
  removeMember
} = require('../controllers/clubController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getClubs);
router.get('/:id', getClubById);

// Protected routes (User)
router.post('/:id/request', protect, requestJoinClub);

// Protected routes (Leader/Admin)
router.get('/:id/requests', protect, getClubRequests);
router.post('/:id/approve/:userId', protect, approveRequest);
router.post('/:id/reject/:userId', protect, rejectRequest);
router.post('/:id/events', protect, addEvent);
router.delete('/:id/events/:eventId', protect, deleteEvent);
router.delete('/:id/members/:userId', protect, removeMember);

// Admin routes
router.post('/', protect, admin, createClub);
router.put('/:id', protect, updateClub); // Removed admin middleware to allow leaders
router.delete('/:id', protect, admin, deleteClub);

module.exports = router;
