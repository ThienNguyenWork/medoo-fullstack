const Progress = require("../models/Progress");

exports.updateProgress = async (req, res) => {
    try {
      const { courseId, lessonId, watchedSeconds, completed } = req.body;
      const userId = req.user.userId;
  
      // xây key động: lessons.{lessonId}.watchedSeconds / completed
      const update = {
        $set: {
          [`lessons.${lessonId}.watchedSeconds`]: watchedSeconds,
          [`lessons.${lessonId}.completed`]: completed ?? false
        }
      };
  
      const progress = await Progress.findOneAndUpdate(
        { userId, courseId },
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
  
      // 1. Lấy một document duy nhất
      const progressDoc = await Progress.findOne({ userId, courseId }).lean();
  
      // 2. Nếu chưa có, trả về empty map
      if (!progressDoc) {
        return res.json({ progress: {} });
      }
  
      // 3. Convert Map lessons thành object: { [lessonId]: watchedSeconds }
      const progressMap = {};
      // nếu muốn luôn cả completed thì lưu value ={ watchedSeconds, completed }
      for (const [lessonId, { watchedSeconds }] of Object.entries(progressDoc.lessons || {})) {
        progressMap[lessonId] = watchedSeconds;
      }
  
      return res.json({ progress: progressMap });
    } catch (error) {
      console.error("❌ getProgress error:", error);
      return res.status(500).json({ message: "Lỗi tải tiến trình" });
    }
  };
  