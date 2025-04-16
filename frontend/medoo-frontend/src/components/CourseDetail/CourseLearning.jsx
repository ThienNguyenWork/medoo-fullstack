// components/CourseDetail/CourseLearning.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  // Lấy dữ liệu khóa học
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await courseService.getCourse(courseId);
        const fetchedCourse = resp.data.course;
        setCourse(fetchedCourse);

        const { chapters, lessons } = parseContentFromDB(
          fetchedCourse.content || []
        );
        setChapters(chapters);
        setLessons(lessons);
      } catch (err) {
        console.error("Lỗi khi tải data khóa học:", err);
      }
    };
    fetchData();
  }, [courseId]);

  // Chọn mặc định bài học đầu tiên của chương đầu tiên (nếu có)
  useEffect(() => {
    if (chapters.length > 0 && lessons.length > 0) {
      const firstChapter = chapters[0];
      const firstLesson = lessons.find((ls) => ls.chapterId === firstChapter._id);
      if (firstLesson) {
        setSelectedLesson(firstLesson);
      }
    }
  }, [chapters, lessons]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  if (!course) {
    return <p className="p-4 text-white">Đang tải dữ liệu khóa học...</p>;
  }

  return (
    <div className="bg-[#1E293B] min-h-screen py-6 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Bố cục 2 cột */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* CỘT VIDEO - Chiếm 70% width và responsive */}
          <div className="flex-grow lg:w-[70%]">
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              {selectedLesson && selectedLesson.videoUrl ? (
                <video
                  src={`/${selectedLesson.videoUrl}`}
                  controls
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700">
                  <p className="text-gray-300">Chưa có video</p>
                </div>
              )}
            </div>
            
            {/* Thông tin bài học */}
            {selectedLesson && (
              <div className="mt-4 p-3 bg-[#1A1F2A] rounded-lg">
                <h2 className="text-lg font-semibold">
                  {selectedLesson.title} - {selectedLesson.duration}
                </h2>
              </div>
            )}
          </div>

          {/* CỘT DANH SÁCH BÀI HỌC - Chiếm 30% width */}
          <div className="w-full lg:w-[30%] flex flex-col">
            <div className="bg-[#1A1F2A] rounded-lg shadow-lg flex-1 flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 bg-[#111827] rounded-t-lg">
                <h3 className="text-lg font-semibold">Nội dung khóa học</h3>
                <p className="text-sm text-gray-300">
                  {chapters.length} chương • {lessons.length} bài học
                </p>
              </div>

              {/* Danh sách bài học - Có thanh cuộn nếu quá nhiều */}
              <div className="flex-1 overflow-y-auto max-h-[80vh] p-4">
                {chapters.map((chapter) => (
                  <div key={chapter._id} className="mb-3 last:mb-0">
                    {/* Chương */}
                    <div
                      onClick={() => toggleChapter(chapter._id)}
                      className="flex justify-between items-center p-2 hover:bg-[#2D3748] rounded cursor-pointer"
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">
                          {expandedChapters.includes(chapter._id) ? "▼" : "▶"}
                        </span>
                        <span className="line-clamp-1">{chapter.title}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {lessons.filter(ls => ls.chapterId === chapter._id).length} bài
                      </span>
                    </div>

                    {/* Danh sách bài học của chương */}
                    {expandedChapters.includes(chapter._id) && (
                      <div className="ml-6 pl-2 border-l-2 border-gray-600">
                        {lessons
                          .filter(ls => ls.chapterId === chapter._id)
                          .map(ls => (
                            <div
                              key={ls._id}
                              className={`p-2 text-sm rounded cursor-pointer ${selectedLesson?._id === ls._id ? "bg-purple-800/30 text-purple-400" : "hover:bg-gray-700/30"}`}
                              onClick={() => ls.videoUrl && setSelectedLesson(ls)}
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
    </div>
  );
};

export default CourseLearning;
