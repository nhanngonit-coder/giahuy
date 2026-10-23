const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 587, secure: process.env.SMTP_PORT == 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
const sendMail = o => mailer.sendMail({ from: `"SportZone" <${process.env.SMTP_USER}>`, ...o });
const adminMail = () => process.env.MAIL_TO || process.env.SMTP_USER;

module.exports = { sendMail, adminMail };
