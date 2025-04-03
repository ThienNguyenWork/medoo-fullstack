const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Kiểm tra từ req.user đã có trong auth middleware
    if (!req.user.isTeacher) {
      return res.status(403).json({ 
        success: false, 
        message: 'Truy cập bị từ chối: Yêu cầu quyền giáo viên',
        errorCode: 'TEACHER_ACCESS_REQUIRED',
        required: true
      });
    }

    // Kiểm tra tài khoản giáo viên đã được phê duyệt chưa (nếu có)
    if (req.user.teacherProfile && !req.user.teacherProfile.approved) {
      return res.status(403).json({ 
        success: false, 
        message: 'Tài khoản giáo viên chưa được phê duyệt',
        errorCode: 'TEACHER_NOT_APPROVED' 
      });
    }

    next();
  } catch (error) {
    console.error('Teacher Auth Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi kiểm tra quyền giáo viên',
      errorCode: 'INTERNAL_SERVER_ERROR' 
    });
  }
};