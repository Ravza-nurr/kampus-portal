const Gallery = require('../models/Gallery');
const { logActivity } = require('./activityController');

// @desc    Get all gallery items
// @route   GET /gallery
// @access  Public
const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({}).sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add image to gallery
// @route   POST /gallery
// @access  Private/Admin
const addGalleryItem = async (req, res) => {
  try {
    const { url, caption } = req.body;

    const galleryItem = new Gallery({
      url,
      caption,
    });

    const createdItem = await galleryItem.save();
    
    // Log activity
    await logActivity(
      req.user._id, 
      'create', 
      'gallery', 
      caption || 'Fotoğraf', 
      caption ? `Galeri fotoğrafı eklendi: "${caption}"` : 'Galeri fotoğrafı eklendi'
    );
    
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (item) {
      const photoCaption = item.caption;
      await item.deleteOne();
      
      // Log activity
      await logActivity(
        req.user._id, 
        'delete', 
        'gallery', 
        photoCaption || 'Fotoğraf', 
        photoCaption ? `Galeri fotoğrafı silindi: "${photoCaption}"` : 'Galeri fotoğrafı silindi'
      );
      
      res.json({ message: 'Photo removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGallery,
  addGalleryItem,
  deleteGalleryItem,
};
