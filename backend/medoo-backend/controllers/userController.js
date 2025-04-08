const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Đăng ký người dùng
exports.register = async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc username đã được sử dụng'
      });
    }

    // Kiểm tra xem đã có tài khoản admin chưa,
    // Nếu chưa có, thì tài khoản này sẽ được tạo với role 'admin'
    // Ngược lại, role mặc định là 'user'
    const adminExists = await User.findOne({ role: 'admin' });
    const role = adminExists ? 'user' : 'admin';

    // Tạo người dùng mới với role đã xác định
    const newUser = new User({
      username,
      email,
      password,
      walletAddress: walletAddress || null,
      role,
    });

    await newUser.save();

    // Tạo token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isTeacher: newUser.isTeacher,
        walletAddress: newUser.walletAddress,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng ký',
      error: error.message
    });
  }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem email tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isTeacher: user.isTeacher,
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
};

// Lấy thông tin người dùng hiện tại
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin người dùng',
      error: error.message
    });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { username, email, walletAddress } = req.body;

    // Tạo đối tượng cập nhật
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (walletAddress) updateData.walletAddress = walletAddress;

    // Tìm và cập nhật người dùng theo id (đã được middleware xác thực)
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin người dùng',
      error: error.message
    });
  }
};

// Phân quyền - Nâng cấp thành giáo viên
exports.becomeTeacher = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { isTeacher: true } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bạn đã trở thành giáo viên',
      user
    });
  } catch (error) {
    console.error('Become teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật quyền giáo viên',
      error: error.message
    });
  }
};
