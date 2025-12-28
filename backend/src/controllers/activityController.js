const Activity = require('../models/Activity');

// @desc    Get recent activities (last 24 hours)
// @route   GET /activities/recent
// @access  Private/Admin
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(); // Use lean() for better performance
    
    // Return empty array if no activities found
    res.json(activities || []);
  } catch (error) {
    console.error('Activity fetch error:', error);
    // Return empty array instead of error to prevent dashboard crash
    res.json([]);
  }
};

// Helper function to log activity
const logActivity = async (userId, action, targetType, targetTitle, description) => {
  try {
    await Activity.create({
      user: userId,
      action,
      targetType,
      targetTitle,
      description
    });
  } catch (error) {
    console.error('Activity log error:', error);
  }
};

module.exports = { 
  getRecentActivities, 
  logActivity 
};
