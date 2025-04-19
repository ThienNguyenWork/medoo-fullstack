const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const courseController = require('../controllers/courseController');
const upload = require('../middleware/upload');

// Lấy tất cả courses
router.get('/', courseController.getAllCourses);

// Lấy 1 course
router.get('/:id', courseController.getCourseById);

// Tạo course (yêu cầu phải đăng nhập)
router.post('/', auth, courseController.createCourse);

// Cập nhật course
router.put('/:id', auth, courseController.updateCourse);

// Xoá course
router.delete('/:id', auth, courseController.deleteCourse);

// Route upload video (chỉ cho các file video)
router.post('/upload-video', auth, upload.single('video'), courseController.uploadVideo);

// -----------------------------
// Mock payment test
// POST /api/courses/:id/payment/test
router.post('/:id/payment/test', (req, res) => {
  return res.status(200).json({
    success: true,
    courseId: req.params.id,
    message: 'Payment test successful',
  });
});
// -----------------------------

module.exports = router;
