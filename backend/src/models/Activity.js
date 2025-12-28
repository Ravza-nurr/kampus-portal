const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete']
  },
  targetType: {
    type: String,
    required: true,
    enum: ['news', 'announcement', 'gallery', 'page', 'club', 'user']
  },
  targetTitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Auto-delete activities older than 24 hours (86400 seconds)
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
