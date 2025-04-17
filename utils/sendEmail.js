const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log('Email config error:', error);
    } else {
      console.log('Email server is ready to send messages!');
    }
  });

  await transporter.sendMail({
    from: `"Auth System" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
