import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { courseService } from "../../services/api";
import { parseDuration, formatDuration } from "../../utils/durationUtils";
import { parseContentFromDB } from "./CourseDetail";
import debounce from "lodash.debounce";

const parseDurationSeconds = (str) => parseDuration(str) * 60;
const MAX_SKIP_SECONDS = 15;

const CourseLearning = () => {
  const { slugId } = useParams();
  const courseId = slugId.split("-").pop();

  // State management
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [introduction, setIntroduction] = useState("");
  const [courseDetail, setCourseDetail] = useState("");
  const [related, setRelated] = useState([]);
  const [progress, setProgress] = useState({});
  const [hasPlayed, setHasPlayed] = useState(false);
  const [lastPosition, setLastPosition] = useState(0);
  const videoRef = useRef(null);

  // Debounce function for progress updates
  const debouncedProgress = useRef(
    debounce(async (courseId, lessonId, watchedSeconds, totalDuration) => {
      try {
        await courseService.updateProgress(
          courseId, 
          lessonId, 
          watchedSeconds,
          totalDuration
        );
        
        // Refresh progress after update
        const { data: newProgress } = await courseService.getProgress(courseId);
        setProgress(newProgress.progress || {});
      } catch (error) {
        console.error("Lỗi cập nhật tiến trình:", error);
      }
    }, 1500)
  ).current;

  // Fetch course data and progress
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Load course content
        const { data: courseData } = await courseService.getCourse(courseId);
        const parsedContent = parseContentFromDB(courseData.course.content || []);
        
        setChapters(parsedContent.chapters);
        setLessons(parsedContent.lessons);
        setIntroduction(parsedContent.introduction);
        setCourseDetail(parsedContent.courseDetail.join("\n"));

        // Load related courses
        const { data: allCourses } = await courseService.getAllCourses();
        setRelated(allCourses.courses.filter(c => c._id !== courseId).slice(0, 3));

        // Load user progress
        const { data: progressData } = await courseService.getProgress(courseId);
        const initialProgress = progressData.progress || {};
        
        // Find first uncompleted lesson
        const firstUncompleted = parsedContent.lessons.find(lesson => {
          return !initialProgress[lesson._id]?.completed;
        }) || parsedContent.lessons[0];

        setSelectedLesson(firstUncompleted);
        setProgress(initialProgress);
        setLastPosition(initialProgress[firstUncompleted?._id]?.watchedSeconds || 0);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Video time update handler
  const handleTimeUpdate = useCallback((e) => {
    if (!selectedLesson || !hasPlayed) return;
    
    const currentTime = Math.floor(e.target.currentTime);
    const lessonDuration = parseDurationSeconds(selectedLesson.duration);

    // Prevent excessive skipping
    if (currentTime > lastPosition + MAX_SKIP_SECONDS) {
      e.target.currentTime = lastPosition;
      alert(`Bạn chỉ được skip tối đa ${MAX_SKIP_SECONDS} giây`);
      return;
    }

    // Update progress state
    const clampedTime = Math.min(currentTime, lessonDuration);
    setLastPosition(clampedTime);
    debouncedProgress(
      courseId, 
      selectedLesson._id, 
      clampedTime,
      lessonDuration
    );
  }, [selectedLesson, hasPlayed, lastPosition, courseId, debouncedProgress]);

  // Video ended handler
  const handleEnded = useCallback(() => {
    if (!selectedLesson) return;
    const lessonDuration = parseDurationSeconds(selectedLesson.duration);
    debouncedProgress(
      courseId, 
      selectedLesson._id, 
      lessonDuration,
      lessonDuration
    );
  }, [selectedLesson, courseId, debouncedProgress]);

  // Chapter expansion toggle
  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId) 
        : [...prev, chapterId]
    );
  };

  // Calculate progress percentages
  const totalSeconds = lessons.reduce(
    (sum, lesson) => sum + parseDurationSeconds(lesson.duration), 0
  );

  const watchedSeconds = Object.entries(progress).reduce(
    (sum, [id, data]) => {
      const lesson = lessons.find(l => l._id === id);
      const maxSeconds = lesson ? parseDurationSeconds(lesson.duration) : 0;
      return sum + Math.min(data?.watchedSeconds || 0, maxSeconds);
    }, 0
  );

  const progressPercent = totalSeconds > 0 
    ? Math.round((watchedSeconds / totalSeconds) * 100)
    : 0;

  if (loading) return <div className="p-4 text-white">Đang tải nội dung...</div>;

  return (
    <div className="min-h-screen">
      {/* Video Section */}
      <div className="bg-[#1E293B] text-white h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto h-full px-4 py-6 flex lg:flex-row flex-col gap-6">
          {/* Video Player */}
          <div className="lg:w-[70%] bg-black rounded-lg overflow-hidden">
            <div className="relative pt-[56.25%]">
              {selectedLesson?.videoUrl ? (
                <video
                  ref={videoRef}
                  src={`/${selectedLesson.videoUrl}`}
                  controls
                  onPlay={() => setHasPlayed(true)}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <p className="text-gray-300">Vui lòng chọn bài học</p>
                </div>
              )}
            </div>
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:w-[30%] flex flex-col">
            <div className="bg-[#111827] rounded-lg flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Nội dung khóa học</h3>
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {progressPercent}% hoàn thành • Đã xem {formatDuration(Math.floor(watchedSeconds/60))}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {chapters.map(chapter => (
                  <div key={chapter._id} className="mb-3">
                    <div 
                      onClick={() => toggleChapter(chapter._id)}
                      className="flex justify-between items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">
                          {expandedChapters.includes(chapter._id) ? '▼' : '▶'}
                        </span>
                        <span className="line-clamp-1">{chapter.title}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {lessons.filter(l => l.chapterId === chapter._id).length} bài
                      </span>
                    </div>

                    {expandedChapters.includes(chapter._id) && (
                      <div className="ml-4 pl-2 border-l-2 border-gray-600">
                        {lessons
                          .filter(l => l.chapterId === chapter._id)
                          .map(lesson => (
                            <div
                              key={lesson._id}
                              onClick={() => {
                                setHasPlayed(false);
                                setSelectedLesson(lesson);
                              }}
                              className={`p-2 text-sm rounded cursor-pointer hover:bg-gray-700/30 ${
                                selectedLesson?._id === lesson._id 
                                  ? 'bg-purple-500/10 border-l-2 border-purple-400' 
                                  : ''
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{lesson.title}</span>
                                <span className="text-xs text-gray-400">
                                  {formatDuration(parseDuration(lesson.duration))}
                                </span>
                              </div>
                              <div className="h-1 bg-gray-700 mt-1 rounded-full">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      ((progress[lesson._id]?.watchedSeconds || 0) / 
                                      parseDurationSeconds(lesson.duration)) * 100,
                                      100
                                    )}%`
                                  }}
                                />
                                {progress[lesson._id]?.completed && (
                                  <span className="text-xs text-green-500 ml-2">✓</span>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <div className="bg-white rounded-lg shadow-lg mx-auto w-full lg:w-fit">
            <div className="flex overflow-x-auto">
              {['Tổng quan', 'Tài liệu', 'Hỏi & Đáp', 'Sự kiện', 'Đánh giá'].map((tab) => (
                <button
                  key={tab}
                  className="px-6 py-3 text-gray-600 hover:text-purple-600 whitespace-nowrap"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Giới thiệu khóa học</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {introduction}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bạn sẽ học được gì?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseDetail.split("\n").map((benefit, index) => (
                    <li key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mr-3 mt-1" 
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24">
                        <path strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="lg:w-[30%]">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Khóa học liên quan</h3>
              <div className="space-y-4">
                {related.map(course => (
                  <Link
                    key={course._id}
                    to={`/course/${course.title.replace(/\s+/g, '-').toLowerCase()}-${course._id}`}
                    className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <img src={course.thumbnail} 
                         alt={course.title}
                         className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-medium text-gray-800 line-clamp-2">{course.title}</h4>
                      <p className="text-sm text-purple-600 font-semibold mt-1">
                        {course.price?.toLocaleString() || 'Miễn phí'} VNĐ
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;