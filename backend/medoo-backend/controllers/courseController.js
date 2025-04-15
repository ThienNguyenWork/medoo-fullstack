// controllers/courseController.js
const Course = require('../models/Course');

// Lấy tất cả courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Lấy chi tiết 1 course
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('author', 'username');

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    res.json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Tạo course (admin hoặc tác giả)
exports.createCourse = async (req, res) => {
  try {
    const {
      title, description, price, category, thumbnail, content, duration
    } = req.body;

    // req.user đã được gắn thông tin từ middleware auth (userId, role, ...)
    const course = new Course({
      title,
      description,
      author: req.user.userId,
      price,
      category,
      thumbnail,
      content: content || [],       // Lưu nội dung được gom gọn vào mảng 'content'
      duration: duration || ""
    });

    await course.save();
    res.status(201).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Cập nhật course (chỉ tác giả hoặc admin)
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra quyền: tác giả hoặc admin
    if (course.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa' });
    }
    
    // req.body có thể chứa các trường cập nhật, bao gồm cả content (mảng duy nhất)
    const updateData = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );
    
    res.json({ course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Xóa course (chỉ tác giả hoặc admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    if (course.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa' });
    }
    await course.deleteOne();
    res.json({ message: 'Khóa học đã được xóa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Hàm xử lý upload video
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Chưa có file nào được upload.' });
    }
    // Trả về đường dẫn file đã lưu (lưu ý: nếu bạn đã cấu hình express.static thì đường dẫn này sẽ dùng để truy cập file)
    res.status(200).json({
      message: 'Upload video thành công!',
      videoPath: req.file.path
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi upload video', error: error.message });
  }
};
