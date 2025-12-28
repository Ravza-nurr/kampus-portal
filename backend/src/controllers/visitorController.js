const Visitor = require('../models/Visitor');

// @desc    Track visitor
// @route   POST /visitors/track
// @access  Public
const trackVisitor = async (req, res) => {
  try {
    const ip = req.body.ip || req.ip;

    const visitor = await Visitor.findOneAndUpdate(
      { ip },
      { lastVisit: Date.now() },
      { new: true, upsert: true }
    );

    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total visitors
// @route   GET /visitors/total
// @access  Public
const getTotalVisitors = async (req, res) => {
  try {
    const count = await Visitor.countDocuments();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get online visitors (last 5 mins)
// @route   GET /visitors/online
// @access  Public
const getOnlineVisitors = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const count = await Visitor.countDocuments({ lastVisit: { $gte: fiveMinutesAgo } });
    res.json({ online: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  trackVisitor,
  getTotalVisitors,
  getOnlineVisitors,
};
