const Page = require('../models/Page');

// @desc    Get page content
// @route   GET /pages
// @access  Public
const getPages = async (req, res) => {
  try {
    const page = await Page.findOne();
    if (page) {
      res.json(page);
    } else {
      // Return empty structure if not found
      res.json({ homeText: '', aboutText: '', contactText: '', footerText: '', email: '', phoneNumber: '' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update page content
// @route   PUT /pages
// @access  Private/Admin
const updatePages = async (req, res) => {
  try {
    const { homeText, aboutText, contactText, footerText, email, phoneNumber } = req.body;

    // Upsert: update if exists, insert if not
    const page = await Page.findOneAndUpdate(
      {},
      { homeText, aboutText, contactText, footerText, email, phoneNumber },
      { new: true, upsert: true }
    );

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPages,
  updatePages,
};
