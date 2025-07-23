const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// === SEND OTP ===
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  console.log(email);
  

  if (!email) return res.status(400).json({ msg: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'User not found' });

  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is: ${otp}`,
  });
  console.log(otp);
  

  res.json({ msg: 'OTP sent to your email' });
});

// === VERIFY OTP ===
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
  if (Date.now() > user.otpExpiry) return res.status(400).json({ msg: 'OTP expired' });
   console.log("otp verified");
   
  res.json({ msg:' OTP verified successfully' });
});

// // === RESET PASSWORD ===
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Just assign the new plain password — pre-save hook will hash it
    user.password = newPassword;

    // Clear OTP and expiry
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
