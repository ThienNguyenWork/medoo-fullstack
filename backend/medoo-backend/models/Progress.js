const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  lessons: {
    type: Map,
    of: new mongoose.Schema({
      watchedSeconds: { type: Number, default: 0 },
      completed:      { type: Boolean, default: false }
    }, { _id: false }),
    default: {}
  }
}, { timestamps: true });

// 1 document duy nhất cho mỗi cặp user+course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
