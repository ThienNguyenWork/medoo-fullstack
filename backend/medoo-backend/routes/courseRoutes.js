// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const courseController = require('../controllers/courseController');

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

module.exports = router;
