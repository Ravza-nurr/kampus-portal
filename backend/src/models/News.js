const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
