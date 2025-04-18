const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  codeExpiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
