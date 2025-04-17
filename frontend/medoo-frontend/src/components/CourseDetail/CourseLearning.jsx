import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courseService } from "../../services/api";
import { parseContentFromDB } from "./CourseDetail";

const CourseLearning = () => {
  const { slugId } = useParams();
  const courseId = slugId.split("-").pop();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [introduction, setIntroduction] = useState("");
  const [courseDetail, setCourseDetail] = useState("");
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await courseService.getCourse(courseId);
        const fetched = resp.data.course;
        setCourse(fetched);
        const { chapters, lessons, introduction, courseDetail } = parseContentFromDB(
          fetched.content || []
        );
        setChapters(chapters);
        setLessons(lessons);
        setIntroduction(introduction);
        setCourseDetail(courseDetail.join("\n"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [courseId]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const resp = await courseService.getAllCourses();
        setRelated(resp.data.courses.filter(c => c._id !== courseId).slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [courseId]);

  useEffect(() => {
    if (chapters.length && lessons.length) {
      const firstLs = lessons.find(ls => ls.chapterId === chapters[0]._id);
      if (firstLs) setSelectedLesson(firstLs);
    }
  }, [chapters, lessons]);

  const toggleChapter = id => {
    setExpandedChapters(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (!course) return <p className="p-4 text-white">Đang tải...</p>;

  return (
    <div className="min-h-screen">

      {/* Div 1: full-width dark background including container */}
      <div className="bg-[#1E293B] text-white h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto h-full px-4 py-6 flex lg:flex-row flex-col gap-6">

          {/* Video */}
          <div className="lg:w-[70%] bg-black rounded-lg overflow-hidden">
            <div className="relative pt-[56.25%]">
              {selectedLesson?.videoUrl ? (
                <video
                  src={`/${selectedLesson.videoUrl}`}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <p className="text-gray-300">Vui lòng chọn bài học</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Nội dung khóa học */}
          <div className="lg:w-[30%] flex flex-col">
            <div className="bg-[#111827] rounded-lg flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold">Nội dung khóa học</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {chapters.length} chương • {lessons.length} bài học
                </p>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                {chapters.map(ch => (
                  <div key={ch._id} className="mb-3">
                    <div
                      onClick={() => toggleChapter(ch._id)}
                      className="flex justify-between p-2 hover:bg-[#2D3748] rounded cursor-pointer"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{expandedChapters.includes(ch._id) ? '▼' : '▶'}</span>
                        <span className="line-clamp-1">{ch.title}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {lessons.filter(ls => ls.chapterId === ch._id).length} bài
                      </span>
                    </div>
                    {expandedChapters.includes(ch._id) && (
                      <div className="ml-6 pl-2 border-l-2 border-gray-600">
                        {lessons.filter(ls => ls.chapterId === ch._id).map(ls => (
                          <div
                            key={ls._id}
                            onClick={() => ls.videoUrl && setSelectedLesson(ls)}
                            className="p-2 hover:bg-gray-700/30 rounded cursor-pointer text-sm"
                          >
                            {ls.title}
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

      {/* Div 2: white background wrapper */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

          {/* Tabs card centered */}
          <div className="bg-white rounded-lg shadow mx-auto w-full lg:w-fit">
            <div className="flex">
              {['Tổng quan', 'Tài liệu', 'Hỏi & Đáp', 'Sự kiện', 'Đánh giá'].map(tab => (
                <button key={tab} className="px-6 py-3 text-gray-600 hover:text-gray-800">
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content and Sidebar Related */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content */}
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Giới thiệu</h2>
                <p className="text-gray-700 leading-relaxed">
                  {introduction}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lợi ích từ khóa học</h2>
                <ul className="space-y-4">
                  {courseDetail.split("\n").map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mr-3 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar Related Courses */}
            <div className="w-full lg:w-[30%]">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Khóa học liên quan</h3>
              <div className="space-y-4">
                {related.map(rc => (
                  <Link
                    key={rc._id}
                    to={`/course/${rc.title.replace(/\s+/g, '-').toLowerCase()}-${rc._id}`}
                    className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded"
                  >
                    <img
                      src={rc.thumbnail}
                      alt={rc.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-gray-800 font-medium line-clamp-2">{rc.title}</p>
                      <span className="text-purple-600 font-bold">{rc.price.toLocaleString()} VNĐ</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseLearning;