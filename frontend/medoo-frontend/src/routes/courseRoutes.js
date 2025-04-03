const express = require('express');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    
    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
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
});

// Create course (teacher only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, category, thumbnail, content } = req.body;
    
    // Create new course
    const course = new Course({
      title,
      description,
      author: req.user.userId,
      price,
      category,
      thumbnail,
      content
    });
    
    await course.save();
    
    res.status(201).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Update course (author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Check if user is the author
    if (course.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa' });
    }
    
    // Update course fields
    const updateData = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json({ course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Delete course (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Check if user is the author
    if (course.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Không có quyền xóa' });
    }
    
    await course.deleteOne();
    
    res.json({ message: 'Khóa học đã được xóa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;