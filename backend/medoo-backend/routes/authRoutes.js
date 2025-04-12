// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, validateToken } = require('../controllers/authController');

// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Xác nhận email
router.get('/verify', verifyEmail);

// Ví dụ: route xác thực token, cần middleware để giải mã token (nếu có)
// router.get('/me', authMiddleware, validateToken);

module.exports = router;
