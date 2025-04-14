// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Lấy token từ header hoặc cookie
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.cookies?.token;
      
    console.log("Token nhận được từ frontend:", token); // Kiểm tra token ở backend
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Truy cập bị từ chối: Token không tồn tại',
        errorCode: 'MISSING_TOKEN' 
      });
    }

    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user và kiểm tra trạng thái tài khoản
    const user = await User.findById(decoded.id).select('-password -__v -resetPasswordToken -resetPasswordExpire');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Tài khoản không tồn tại',
        errorCode: 'USER_NOT_FOUND' 
      });
    }

    // Kiểm tra email đã xác thực chưa
    if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !user.emailVerified && user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Vui lòng xác thực email trước khi tiếp tục',
        errorCode: 'EMAIL_NOT_VERIFIED' 
      });
    }

    // Cập nhật thời gian hoạt động cuối
    user.lastActive = new Date();
    await user.save();

    // Gắn thông tin user vào request
    req.user = {
      userId: user._id,
      username: user.username,
      role: user.role,
      walletAddress: user.walletAddress,
      email: user.email
    };

    next();
  } catch (error) {
    let message = 'Lỗi xác thực';
    if (error.name === 'TokenExpiredError') {
      message = 'Token đã hết hạn';  // Thông báo rõ ràng khi token hết hạn
    }
    if (error.name === 'JsonWebTokenError') {
      message = 'Token không hợp lệ';  // Thông báo khi token không hợp lệ
    }

    res.status(401).json({ 
      success: false, 
      message,
      errorCode: error.name,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

// Hàm kiểm tra quyền admin (bổ sung)
exports.checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};
