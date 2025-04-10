const express = require('express');
const User = require('../models/User'); // Import model User
const router = express.Router();

// Đăng ký người dùng
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;

    // Kiểm tra email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
    }

    // Tạo user mới
    const newUser = new User({
      username,
      email,
      password, // Mật khẩu sẽ được hash trong `User.js`
      walletAddress
    });

    // Lưu vào database
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
