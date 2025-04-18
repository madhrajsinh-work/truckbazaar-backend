const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const code = generateCode();
    const expires = new Date(Date.now() + 60 * 1000);

    const newUser = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      verificationCode: code,
      codeExpiresAt: expires,
    });

    await sendEmail(email, 'Verify your email', code, username);
    res.status(201).json({ msg: 'Verification code sent to email' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ msg: 'Invalid or expired code' });
    }
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.resendCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (user.isVerified) return res.status(400).json({ msg: 'User already verified' });

    if (user.codeExpiresAt && user.codeExpiresAt > new Date()) {
      const remaining = Math.ceil((user.codeExpiresAt - Date.now()) / 1000);
      return res.status(400).json({ msg: `Please wait ${remaining}s before requesting a new code` });
    }

    const newCode = generateCode();
    user.verificationCode = newCode;
    user.codeExpiresAt = new Date(Date.now() + 60 * 1000);
    await user.save();

    await sendEmail(email, 'Verify your email', newCode, user.username);
    res.json({ msg: 'A new verification code has been sent' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (!user.isVerified) return res.status(400).json({ msg: 'Email not verified' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password -verificationCode');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
