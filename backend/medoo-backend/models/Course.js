// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: ""
  },
  thumbnail: {
    type: String,
    default: ""
  },

  // ----- TẤT CẢ NỘI DUNG (chapters, lessons, teacher, benefits, courseDetail, reviews,...) -----
  // ----- sẽ được gom vào 1 mảng content -----
  content: [
    {
      blockType: { type: String },
      data: mongoose.Schema.Types.Mixed
    }
  ],

  // Các trường cơ bản khác
  description: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
