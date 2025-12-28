const News = require('../models/News');
const createSlug = require('../utils/slugify');
const { logActivity } = require('./activityController');

// @desc    Get all news
// @route   GET /news
// @access  Public
const getNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single news by slug
// @route   GET /news/:slug
// @access  Public
const getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a news
// @route   POST /news
// @access  Private/Admin
const createNews = async (req, res) => {
  try {
    const { title, summary, content, imageUrl, date } = req.body;

    const slug = createSlug(title);

    const news = new News({
      title,
      summary,
      content,
      imageUrl,
      slug,
      date,
    });

    const createdNews = await news.save();
    
    // Log activity
    console.log('Attempting to log activity for news creation...', { userId: req.user._id, title });
    try {
      await logActivity(
        req.user._id, 
        'create', 
        'news', 
        title, 
        `Yeni haber eklendi: "${title}"`
      );
      console.log('Activity logged successfully');
    } catch (activityError) {
      console.error('Activity logging failed:', activityError);
    }
    
    res.status(201).json(createdNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a news
// @route   PUT /news/:slug
// @access  Private/Admin
const updateNews = async (req, res) => {
  try {
    const { title, summary, content, imageUrl, date } = req.body;

    const news = await News.findOne({ slug: req.params.slug });

    if (news) {
      news.title = title || news.title;
      news.summary = summary || news.summary;
      news.content = content || news.content;
      news.imageUrl = imageUrl || news.imageUrl;
      news.date = date || news.date;
      
      if (title) {
        news.slug = createSlug(title);
      }

      const updatedNews = await news.save();
      
      // Log activity
      await logActivity(
        req.user._id, 
        'update', 
        'news', 
        updatedNews.title, 
        `Haber güncellendi: "${updatedNews.title}"`
      );
      
      res.json(updatedNews);
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a news
// @route   DELETE /news/:slug
// @access  Private/Admin
const deleteNews = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });

    if (news) {
      const newsTitle = news.title;
      await news.deleteOne();
      
      // Log activity
      await logActivity(
        req.user._id, 
        'delete', 
        'news', 
        newsTitle, 
        `Haber silindi: "${newsTitle}"`
      );
      
      res.json({ message: 'News removed' });
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
};
