// utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // ví dụ: support@yourcompany.com
    pass: process.env.GMAIL_PASS, // App password (nếu có 2FA)
  },
});

exports.sendConfirmationEmail = async (to, name) => {
  await transporter.sendMail({
    from: `"Medoo Support" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Xác nhận nhận hỗ trợ từ Medoo',
    html: `
      <p>Chào ${name},</p>
      <p>Chúng tôi đã nhận được yêu cầu hỗ trợ của bạn. Đội ngũ Medoo sẽ phản hồi sớm nhất có thể.</p>
      <p>Trân trọng,<br>Đội ngũ Medoo</p>
    `,
  });
};
