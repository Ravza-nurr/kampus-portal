const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isImportant: {
    type: Boolean,
    default: false,
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

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
