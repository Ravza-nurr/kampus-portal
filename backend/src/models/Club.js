const mongoose = require('mongoose');

const clubSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  leaders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  events: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
  }]
}, {
  timestamps: true,
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
