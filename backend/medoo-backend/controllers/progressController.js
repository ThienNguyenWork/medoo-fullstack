const Progress = require("../models/Progress");

exports.updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId, watchedSeconds, completed } = req.body;
    const userId = req.user.userId;

    const update = {
      $set: {
        [`courses.${courseId}.lessons.${lessonId}.watchedSeconds`]: watchedSeconds,
        [`courses.${courseId}.lessons.${lessonId}.completed`]: completed ?? false,
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

    if (!progressDoc) return res.json({ progress: {} });

    // Nếu có courseId, trả về tiến trình của course đó
    if (courseId) {
      const courseProgress = progressDoc.courses.get(courseId)?.lessons || {};
      return res.json({ progress: courseProgress });
    }

    // Trả về toàn bộ courses của user
    const allCourses = {};
    for (const [courseId, courseData] of progressDoc.courses) {
      allCourses[courseId] = courseData.lessons;
    }

    res.json({ progress: allCourses });
  } catch (error) {
    console.error("❌ getProgress error:", error);
    res.status(500).json({ message: "Lỗi tải tiến trình" });
  }
};
  