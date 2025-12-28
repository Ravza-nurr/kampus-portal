const Announcement = require('../models/Announcement');
const createSlug = require('../utils/slugify');
const { logActivity } = require('./activityController');

// @desc    Get all announcements
// @route   GET /announcements
// @access  Public
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single announcement by slug
// @route   GET /announcements/:slug
// @access  Public
const getAnnouncementBySlug = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({ slug: req.params.slug });
    if (announcement) {
      res.json(announcement);
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an announcement
// @route   POST /announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, description, isImportant, date } = req.body;

    const slug = createSlug(title);

    const announcement = new Announcement({
      title,
      description,
      isImportant,
      date,
      slug,
    });

    const createdAnnouncement = await announcement.save();
    
    // Log activity
    await logActivity(
      req.user._id, 
      'create', 
      'announcement', 
      title, 
      `Yeni duyuru eklendi: "${title}"`
    );
    
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an announcement
// @route   PUT /announcements/:slug
// @access  Private/Admin
const updateAnnouncement = async (req, res) => {
  try {
    const { title, description, isImportant, date } = req.body;

    const announcement = await Announcement.findOne({ slug: req.params.slug });

    if (announcement) {
      announcement.title = title || announcement.title;
      announcement.description = description || announcement.description;
      announcement.date = date || announcement.date;
      announcement.isImportant = isImportant !== undefined ? isImportant : announcement.isImportant;

      if (title) {
        announcement.slug = createSlug(title);
      }

      const updatedAnnouncement = await announcement.save();
      
      // Log activity
      await logActivity(
        req.user._id, 
        'update', 
        'announcement', 
        updatedAnnouncement.title, 
        `Duyuru güncellendi: "${updatedAnnouncement.title}"`
      );
      
      res.json(updatedAnnouncement);
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /announcements/:slug
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({ slug: req.params.slug });

    if (announcement) {
      const announcementTitle = announcement.title;
      await announcement.deleteOne();
      
      // Log activity
      await logActivity(
        req.user._id, 
        'delete', 
        'announcement', 
        announcementTitle, 
        `Duyuru silindi: "${announcementTitle}"`
      );
      
      res.json({ message: 'Announcement removed' });
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnnouncements,
  getAnnouncementBySlug,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
