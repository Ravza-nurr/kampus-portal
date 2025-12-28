const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Announcement = require('./src/models/Announcement');

dotenv.config();

connectDB();

const check = async () => {
  try {
    const announcements = await Announcement.find({});
    console.log('Count:', announcements.length);
    announcements.forEach(a => {
      console.log(`ID: ${a._id}, Title: ${a.title}, Important: ${a.isImportant} (${typeof a.isImportant})`);
    });
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

check();
