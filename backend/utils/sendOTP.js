const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your preferred provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Password Reset",
    html: `<h3>Your OTP is: <b>${otp}</b></h3>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
