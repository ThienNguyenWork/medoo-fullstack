// userRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const authController = require('../controllers/authController');
const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/validate-token', auth, authController.validateToken);

// Cấu hình nodemailer (bạn cần điền thông tin email của mình vào đây)
const transporter = nodemailer.createTransport({
  service: 'gmail', // hoặc service email khác
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;
    
    // Kiểm tra trường bắt buộc
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ thông tin' 
      });
    }
    
    // Kiểm tra người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email hoặc tên người dùng đã được sử dụng' 
      });
    }
    
    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password,
      walletAddress: walletAddress || null
    });
    
    await newUser.save();
    
    // Tạo JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        walletAddress: newUser.walletAddress,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi đăng ký người dùng',
      error: error.message
    });
  }
});

// Đăng nhập người dùng
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kiểm tra trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp email và mật khẩu' 
      });
    }
    
    // Tìm người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi đăng nhập',
      error: error.message
    });
  }
});

// Kết nối ví điện tử
router.post('/connect-wallet', auth, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp địa chỉ ví'
      });
    }
    
    // Kiểm tra xem địa chỉ ví đã được sử dụng chưa
    const existingWallet = await User.findOne({ walletAddress });
    if (existingWallet && existingWallet._id.toString() !== req.user.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Địa chỉ ví đã được liên kết với tài khoản khác'
      });
    }
    
    // Cập nhật địa chỉ ví cho người dùng
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { walletAddress },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Kết nối ví thành công',
      user: updatedUser
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi kết nối ví',
      error: error.message
    });
  }
});

// Lấy thông tin hồ sơ người dùng
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi lấy thông tin hồ sơ',
      error: error.message
    });
  }
});


// Cập nhật thông tin người dùng
router.put('/update', auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Tạo đối tượng cập nhật
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    // Kiểm tra xem email hoặc username đã tồn tại chưa
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== req.user.userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }
    }
    
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== req.user.userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Tên người dùng đã được sử dụng'
        });
      }
    }
    
    // Cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi cập nhật thông tin người dùng',
      error: error.message
    });
  }
});

// Đổi mật khẩu
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới'
      });
    }
    
    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }
    
    // Tìm người dùng với mật khẩu
    const user = await User.findById(req.user.userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }
    
    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đổi mật khẩu',
      error: error.message
    });
  }
});

// Kiểm tra token hợp lệ
router.get('/validate-token', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Token hợp lệ',
    user: req.user
  });
});

// Quên mật khẩu
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email'
      });
    }
    
    // Tìm người dùng với email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản với email này'
      });
    }
    
    // Tạo token đặt lại mật khẩu
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpire = Date.now() + 3600000; // 1 giờ
    
    // Cập nhật người dùng với token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();
    
    // URL đặt lại mật khẩu
    const resetUrl = `${process.env.FRONTEND_URL}/auth?token=${resetToken}`;
    
    // Gửi email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Đặt lại mật khẩu',
      text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết dưới đây để thay đổi mật khẩu của bạn:\n\n${resetUrl}\n\nNếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.`
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi email đặt lại mật khẩu',
      error: error.message
    });
  }
});

// Đặt lại mật khẩu
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp token và mật khẩu mới'
      });
    }

    // Tìm người dùng với token đặt lại mật khẩu
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt lại mật khẩu',
      error: error.message
    });
  }
});

module.exports = router;
