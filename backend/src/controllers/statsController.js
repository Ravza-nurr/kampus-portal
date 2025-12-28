const News = require('../models/News');
const Announcement = require('../models/Announcement');
const Gallery = require('../models/Gallery');
const Visitor = require('../models/Visitor');

const getDashboardStats = async (req, res) => {
  try {
    const newsCount = await News.countDocuments();
    const announcementCount = await Announcement.countDocuments();
    const galleryCount = await Gallery.countDocuments();
    const totalVisitors = await Visitor.countDocuments();
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const onlineUsers = await Visitor.countDocuments({ lastVisit: { $gte: fiveMinutesAgo } });

    res.json({
      newsCount,
      announcementCount,
      galleryCount,
      totalVisitors,
      onlineUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
