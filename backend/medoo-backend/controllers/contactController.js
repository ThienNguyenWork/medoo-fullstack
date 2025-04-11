// controllers/contactController.js
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.createContact = async (req, res) => {
  try {
    const { fullName, email, phone, otherContactMethod, questionType, content } = req.body;

    // Kiểm tra xem email này đã gửi trong vòng 24h chưa
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSubmission = await Contact.findOne({
      email,
      createdAt: { $gte: oneDayAgo },
    });

    if (recentSubmission) {
      return res.status(429).json({
        message: 'Bạn đã gửi hỗ trợ trong vòng 24 giờ qua. Vui lòng thử lại sau.',
      });
    }

    // Lưu contact
    const contact = new Contact({ fullName, email, phone, otherContactMethod, questionType, content });
    await contact.save();

    // Gửi email xác nhận
    await sendConfirmationEmail(email, fullName);

    res.status(201).json({ message: 'Gửi hỗ trợ thành công!' });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};
