const express = require('express');
const router = express.Router();
const {
  trackVisitor,
  getTotalVisitors,
  getOnlineVisitors,
} = require('../controllers/visitorController');

router.post('/track', trackVisitor);
router.get('/total', getTotalVisitors);
router.get('/online', getOnlineVisitors);

module.exports = router;
