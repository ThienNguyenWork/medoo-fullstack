const Progress = require("../models/Progress");

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

    const progressDoc = await Progress.findOne({ userId }).lean();

    if (!progressDoc) return res.json({ 
      progress: {}, 
      stats: { totalLessons: 0, completedLessons: 0, progressPercent: 0 } 
    });

    const courses = progressDoc.courses || {};

    if (courseId) {
      const courseData = courses[courseId] || {};
      const lessons = courseData.lessons || {};
      const lessonList = Object.values(lessons);
      
      // Tính toán phần trăm hoàn thành
      const totalLessons = lessonList.length;
      const completedLessons = lessonList.filter(lesson => lesson.completed).length;
      const progressPercent = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      return res.json({ 
        progress: lessons,
        stats: { totalLessons, completedLessons, progressPercent }
      });
    }

    // Xử lý trả về tất cả courses
    const allCourses = {};
    Object.entries(courses).forEach(([id, courseData]) => {
      allCourses[id] = courseData.lessons;
    });

    res.json({ progress: allCourses });
  } catch (error) {
    console.error("❌ getProgress error:", error);
    res.status(500).json({ message: "Lỗi tải tiến trình" });
  }
};
  