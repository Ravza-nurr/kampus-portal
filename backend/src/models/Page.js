const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
  homeText: {
    type: String,
    default: '',
  },
  aboutText: {
    type: String,
    default: '',
  },
  contactText: {
    type: String,
    default: '',
  },
  footerText: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
