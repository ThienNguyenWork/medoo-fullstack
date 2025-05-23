const Progress = require("../models/Progress");
const mongoose = require("mongoose");
const Course = require("../models/Course");
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId, watchedSeconds, totalDuration } = req.body;
    const userId = req.user.userId;

    // Lấy tiến trình hiện tại
    const existingProgress = await Progress.findOne({ userId });
    const currentLessonProgress = existingProgress?.courses?.get(courseId)?.lessons?.get(lessonId);
    
    // Chỉ cập nhật nếu watchedSeconds mới lớn hơn giá trị hiện tại
    const newWatchedSeconds = Math.max(
      currentLessonProgress?.watchedSeconds || 0, 
      Math.min(watchedSeconds, totalDuration)
    );

    // Tính toán trạng thái completed
    const COMPLETION_THRESHOLD = 0.85;
    const isCompleted = totalDuration > 0 && 
      (newWatchedSeconds / totalDuration) >= COMPLETION_THRESHOLD;

      const update = {
        $set: {
          [`courses.${courseId}.lessons.${lessonId}.watchedSeconds`]: newWatchedSeconds,
          [`courses.${courseId}.lessons.${lessonId}.completed`]: isCompleted,
          [`courses.${courseId}.lessons.${lessonId}.totalDuration`]: totalDuration,
          [`courses.${courseId}.lastAccessed`]: new Date()
        }
      };

    const progress = await Progress.findOneAndUpdate(
      { userId },
      update,
      { upsert: true, new: true, runValidators: true }
    );

    res.json(progress);
  } catch (error) {
    console.error("❌ updateProgress error:", error);
    res.status(500).json({ message: "Lỗi cập nhật tiến trình" });
  }
};
  

exports.getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // Tìm tiến trình của người dùng
    const progressDoc = await Progress.findOne({ userId }).lean();

    if (!progressDoc) {
      return res.status(200).json([]); // Trả về mảng rỗng nếu không có dữ liệu
    }

    const courses = progressDoc.courses || {};

    // Xử lý request có courseId
    if (courseId) {
      const courseData = courses[courseId] || {};
      const lessons = Object.values(courseData.lessons || {});
      
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter(lesson => lesson.completed).length;
      const progressPercent = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      return res.json({
        progress: lessons,
        stats: { totalLessons, completedLessons, progressPercent }
      });
    }

    // Xử lý request không có courseId (get all courses)
    const courseIds = Object.keys(courses);
    const formattedCourses = [];

    if (courseIds.length > 0) {
      // Validate và convert courseIds
      const validCourseIds = courseIds
        .map(id => {
          try {
            return new mongoose.Types.ObjectId(id);
          } catch {
            return null;
          }
        })
        .filter(id => id);

      // Lấy thông tin courses từ database
      const courseDetails = await Course.find(
        { _id: { $in: validCourseIds } },
        "title thumbnail createdAt"
      ).lean();

      // Tạo map để truy cập nhanh
      const courseMap = new Map();
      courseDetails.forEach(course => {
        courseMap.set(course._id.toString(), course);
      });

      // Format dữ liệu response
      courseIds.forEach(id => {
        const courseProgress = courses[id];
        const courseInfo = courseMap.get(id) || {};

        formattedCourses.push({
          id,
          title: courseInfo.title || "Khóa học không có tiêu đề",
          thumbnail: courseInfo.thumbnail || "",
          startDate: courseProgress.lastAccessed || new Date(),
          progressPercent: calculateCourseProgress(courseProgress.lessons),
        });
      });
    }

    res.json(formattedCourses);

  } catch (error) {
    console.error("❌ getProgress error:", error);
    res.status(500).json({
      message: "Lỗi tải tiến trình",
      error: error.message
    });
  }
};

// Hàm tính phần trăm hoàn thành của course
function calculateCourseProgress(lessons) {
  const lessonList = Object.values(lessons || {});
  const totalLessons = lessonList.length;
  if (totalLessons === 0) return 0;
  const completedLessons = lessonList.filter(lesson => lesson.completed).length;
  return Math.round((completedLessons / totalLessons) * 100);
}
  // Thêm hàm getDashboardStats trong ProgressController
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const progressDoc = await Progress.findOne({ userId }).lean();

    if (!progressDoc) {
      return res.json({
        totalCourses: 0,
        completedCourses: 0,
        totalHours: 0,
        ranking: 0
      });
    }

    // Tính toán các thống kê
    let totalHours = 0;
    let completedCourses = 0;
    const courses = progressDoc.courses || {};

    Object.values(courses).forEach(course => {
      const lessons = course.lessons || {};
      
      // Tính tổng giờ học
      Object.values(lessons).forEach(lesson => {
        totalHours += lesson.watchedSeconds / 3600; // Chuyển sang giờ
      });

      // Kiểm tra course hoàn thành (ví dụ: 85% bài học)
      const totalLessons = Object.values(lessons).length;
      const completedLessons = Object.values(lessons).filter(l => l.completed).length;
      if (totalLessons > 0 && (completedLessons / totalLessons) >= 0.85) {
        completedCourses++;
      }
    });

    res.json({
      totalCourses: Object.keys(courses).length,
      completedCourses,
      totalHours: totalHours.toFixed(2),
      ranking: 0 // Tạm thời để 0, cần logic xếp hạng
    });

  } catch (error) {
    console.error("❌ getDashboardStats error:", error);
    res.status(500).json({ message: "Lỗi tải thống kê" });
  }
};