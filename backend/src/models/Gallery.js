const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
