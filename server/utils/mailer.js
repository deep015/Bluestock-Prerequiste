// File: /backend/src/utils/mailer.js

const nodemailer = require('nodemailer');

// Create a transporter object using your SMTP details from the .env file
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER, // your Gmail address
    pass: process.env.SMTP_PASS, // your Gmail app password
  },
});

/**
 * Sends an email using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject line of the email.
 * @param {string} text - The plain-text body of the email.
 */
async function sendEmail(to, subject, text) {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
  }
}

module.exports = { sendEmail };