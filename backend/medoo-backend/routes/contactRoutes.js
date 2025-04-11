const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { fullName, email, phone, otherContactMethod, questionType, content } = req.body;

  try {
    // 1. Lưu thông tin liên hệ vào MongoDB
    const newContact = new Contact(req.body);
    await newContact.save();

    // 2. Tạo transporter gửi email xác nhận cho chính khách hàng
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const htmlMessage = `
      <h2>Chào ${fullName},</h2>
      <p>Cảm ơn bạn đã liên hệ với Medoo! 🎉</p>
      <p>Chúng tôi đã nhận được thông tin của bạn và sẽ phản hồi sớm nhất có thể.</p>
      <hr />
      <h4>📋 Tóm tắt yêu cầu của bạn:</h4>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Số điện thoại:</strong> ${phone}</p>` : ''}
      ${otherContactMethod ? `<p><strong>Phương thức khác:</strong> ${otherContactMethod}</p>` : ''}
      ${questionType ? `<p><strong>Loại câu hỏi:</strong> ${questionType}</p>` : ''}
      <p><strong>Nội dung:</strong><br/>${content}</p>
      <br/>
      <p>Trân trọng,<br/>Đội ngũ Medoo</p>
    `;

    // 3. Gửi mail tới email khách hàng
    await transporter.sendMail({
      from: `"Medoo Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Medoo đã nhận được yêu cầu liên hệ của bạn ✅',
      html: htmlMessage,
    });

    res.status(201).json({ message: 'Đã lưu liên hệ và gửi mail xác nhận cho khách hàng!' });
  } catch (error) {
    console.error('Lỗi xử lý liên hệ:', error);
    res.status(500).json({ message: 'Lỗi khi lưu liên hệ hoặc gửi mail.' });
  }
});

module.exports = router;
