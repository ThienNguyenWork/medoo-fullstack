const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendTestMail() {
  await transporter.sendMail({
    from: `"Medoo Support" <${process.env.GMAIL_USER}>`,
    to: 'your-destination-email@example.com',
    subject: 'Test mail',
    html: '<p>Đây là email thử nghiệm.</p>',
  });

  console.log('Đã gửi email thành công');
}

sendTestMail().catch(console.error);
