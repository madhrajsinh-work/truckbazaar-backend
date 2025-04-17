const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, code, username) => {
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

  const htmlContent = `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f6f8fa; padding: 10px; text-align: center;">
        <img src="https://i.ibb.co/8nVvcd42/Logo.png" alt="Truck Bazaar" style="width: 200px; margin-bottom: 5px;"/>
        <h2 style="color: #333;margin: 0px">Welcome to Truck Bazaar</h2>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size: 16px; color: #333;">Thank you for registering with <strong>Truck Bazaar</strong>. Please use the following verification code to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 28px; font-weight: bold; background-color: #e5f2ff; padding: 10px 20px; border-radius: 6px; color: #007bff;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #777;">If you didn’t request this, please ignore this email.</p>
        <p style="font-size: 14px; color: #777;">– Truck Bazaar Team</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Truck Bazaar" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  });
};

module.exports = sendEmail;
