// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Helper: tạo token đăng nhập (7 ngày)
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper: tạo token xác nhận email (1 ngày)
const generateEmailVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_EMAIL_SECRET, { expiresIn: '1d' });
};

// Hàm gửi email xác nhận
const sendVerificationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,  
      pass: process.env.GMAIL_PASS,  
    },
  });

  // Thay đổi URL dưới đây theo domain/backend của bạn
  const verificationUrl = `http://localhost:5001/api/users/verify?token=${token}`;

  const htmlMessage = `
    <h2>Chào ${user.username},</h2>
    <p>Cảm ơn bạn đã đăng ký tài khoản!</p>
    <p>Vui lòng nhấn vào <a href="${verificationUrl}">đây</a> để xác nhận tài khoản của bạn.</p>
    <p>Nếu không phải bạn đăng ký, xin bỏ qua email này.</p>
    <br/>
    <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
  `;

  await transporter.sendMail({
    from: `"Hỗ trợ" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: 'Xác nhận đăng ký tài khoản',
    html: htmlMessage,
  });
};

// Đăng ký (Register)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra user tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc username đã tồn tại'
      });
    }

    // Tạo user mới với emailVerified mặc định là false
    const user = await User.create({
      username,
      email,
      password,
      emailVerified: false
    });

    // Tạo token xác nhận email
    const emailToken = generateEmailVerificationToken(user._id);

    // Gửi email xác nhận
    await sendVerificationEmail(user, emailToken);

    // Thông báo cho client rằng cần xác nhận email
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng ký'
    });
  }
};

// Xác nhận Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token không hợp lệ' });
  }
  try {
    // Giải mã token xác nhận email
    const payload = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Người dùng không tồn tại' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Tài khoản đã được xác nhận' });
    }

    // Cập nhật trạng thái xác nhận email
    user.emailVerified = true;
    await user.save();

    // Chuyển hướng người dùng về trang đăng nhập (hoặc trang thông báo thành công)
    return res.redirect('https://medoo.vercel.app/auth');
    // Nếu không chuyển hướng, bạn có thể:
    // res.status(200).json({ success: true, message: 'Xác nhận email thành công!' });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Đăng nhập (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user bằng email (bao gồm password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }

    // Kiểm tra xem user đã xác nhận email chưa
    if (!user.emailVerified && user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng xác nhận email trước khi đăng nhập'
      });
    }

    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }

    // Tạo token đăng nhập (7 ngày)
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng nhập'
    });
  }
};

// Xác thực token (Validate token)
exports.validateToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }
};
