const express = require('express');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const asyncHandler = require("express-async-handler");


// OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer config
console.log("enterin to the flow");

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   user: 'jainansul33@gmail.com',
    pass: 'drpb zhux myvs htzp',
  },
});
const sendOtp = asyncHandler(async(req,res)=>{


  const { email } = req.body;
  // console.log(email);
  console.log(process.env.EMAIL_PASS);
  
  
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
    // console.log("nikal gaya");
    
    
  
    res.json({ msg: 'OTP sent to your email' });
    
});


module.exports= {sendOtp};