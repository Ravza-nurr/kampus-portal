const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
}, {
  timestamps: true,
});

adminUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
