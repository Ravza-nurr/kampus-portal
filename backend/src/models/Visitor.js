const mongoose = require('mongoose');

const visitorSchema = mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  lastVisit: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
