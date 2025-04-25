const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true // Chỉ 1 document duy nhất cho mỗi user
  },
  courses: {
    type: Map,
    of: new mongoose.Schema({
      lessons: {
        type: Map,
        of: new mongoose.Schema({
          watchedSeconds: { type: Number, default: 0 },
          completed: { type: Boolean, default: false },
          totalDuration: { type: Number, required: true } // Thêm trường này
        }, { _id: false })
      },
      lastAccessed: { type: Date, default: Date.now }
    }, { _id: false }),
    default: {}
  }
}, { timestamps: true });

// 1 document duy nhất cho mỗi cặp user+course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
