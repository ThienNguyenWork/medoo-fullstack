// components/CourseDetail/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { courseService } from "../../services/api";
import CourseSidebar from "./CourseSidebar";

export function parseContentFromDB(contentArray) {
  let chapters = [];
  let lessons = [];
  let teacher = "";
  let benefits = [];
  let courseDetail = [];
  let reviews = [];
  let introduction = "";

  contentArray.forEach((item) => {
    switch (item.blockType) {
      case "chapters":
        chapters = item.data || [];
        break;
      case "lessons":
        lessons = item.data || [];
        break;
      case "teacher":
        teacher = item.data || "";
        break;
      case "benefits":
        benefits = item.data || [];
        break;
      case "courseDetail":
        courseDetail = item.data || [];
        break;
      case "reviews":
        reviews = item.data || [];
        break;
      case "introduction":
        introduction = item.data || "";
        break;
      default:
        break;
    }
  });

  return {
    chapters,
    lessons,
    teacher,
    benefits,
    courseDetail,
    reviews,
    introduction,
  };
}

function buildContentForDB({
  chapters,
  lessons,
  teacher,
  benefits,
  courseDetail,
  reviews,
  introduction,
}) {
  return [
    { blockType: "chapters", data: chapters },
    { blockType: "lessons", data: lessons },
    { blockType: "teacher", data: teacher },
    { blockType: "benefits", data: benefits },
    { blockType: "courseDetail", data: courseDetail },
    { blockType: "reviews", data: reviews },
    { blockType: "introduction", data: introduction },
  ];
}

const CourseDetail = () => {
  const { slugId } = useParams();


  const role = localStorage.getItem("role") || "user";
  const courseId = slugId.split("-").pop();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [benefits, setBenefits] = useState("");
  const [courseDetail, setCourseDetail] = useState("");
  const [reviews, setReviews] = useState([]);
  const [introduction, setIntroduction] = useState("");

  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState("");

  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("");
  const [newLessonChapterId, setNewLessonChapterId] = useState("");
  const [newLessonVideoFile, setNewLessonVideoFile] = useState(null);
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState("");

  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState("");
  const [editingLessonDuration, setEditingLessonDuration] = useState("");
  const [editingLessonChapterId, setEditingLessonChapterId] = useState("");
  const [editingLessonVideoUrl, setEditingLessonVideoUrl] = useState("");

  const [expandedChapters, setExpandedChapters] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourse(courseId);
        const fetchedCourse = response.data.course;
        setCourse(fetchedCourse);

        const {
          chapters,
          lessons,
          teacher,
          benefits,
          courseDetail,
          reviews,
          introduction,
        } = parseContentFromDB(fetchedCourse.content || []);

        setChapters(chapters);
        setLessons(lessons);
        setTeacher(teacher);
        setBenefits(benefits.join(", "));
        setCourseDetail(courseDetail.join("\n"));
        setReviews(reviews);
        setIntroduction(introduction);

        if (chapters.length > 0) {
          setNewLessonChapterId(chapters[0]._id);
        }
      } catch (error) {
        console.error("Lỗi khi tải khóa học:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newChap = { _id: Date.now().toString(), title: newChapterTitle };
    setChapters([...chapters, newChap]);
    setNewChapterTitle("");
    if (chapters.length === 0) {
      setNewLessonChapterId(newChap._id);
    }
  };

  const handleDeleteChapter = (chapterId) => {
    if (!window.confirm("Bạn có chắc muốn xóa chương này?")) return;
    setChapters(chapters.filter((ch) => ch._id !== chapterId));
    setLessons(lessons.filter((ls) => ls.chapterId !== chapterId));
  };

  const startEditChapter = (chapter) => {
    setEditingChapterId(chapter._id);
    setEditingChapterTitle(chapter.title);
  };

  const handleUpdateChapter = () => {
    setChapters(
      chapters.map((ch) =>
        ch._id === editingChapterId ? { ...ch, title: editingChapterTitle } : ch
      )
    );
    setEditingChapterId(null);
    setEditingChapterTitle("");
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim() || !newLessonChapterId) return;

    let uploadedVideoPath = "";
    if (newLessonVideoFile) {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("video", newLessonVideoFile);

        const resp = await fetch(
          "http://localhost:5001/api/courses/upload-video",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
        const data = await resp.json();
        if (resp.status === 200) {
          uploadedVideoPath = data.videoPath;
        } else {
          alert(data.message || "Upload video thất bại!");
          return;
        }
      } catch (err) {
        console.error("Lỗi khi upload video:", err);
        alert("Lỗi khi upload video!");
        return;
      }
    } else if (newLessonVideoUrl.trim()) {
      uploadedVideoPath = newLessonVideoUrl.trim();
    }

    const newLesson = {
      _id: Date.now().toString(),
      title: newLessonTitle,
      duration: newLessonDuration,
      chapterId: newLessonChapterId,
      videoUrl: uploadedVideoPath,
    };
    setLessons([...lessons, newLesson]);
    setNewLessonTitle("");
    setNewLessonDuration("");
    setNewLessonVideoFile(null);
    setNewLessonVideoUrl("");
  };

  const handleDeleteLesson = (lessonId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài học này?")) return;
    setLessons(lessons.filter((ls) => ls._id !== lessonId));
  };

  const startEditLesson = (lesson) => {
    setEditingLessonId(lesson._id);
    setEditingLessonTitle(lesson.title);
    setEditingLessonDuration(lesson.duration);
    setEditingLessonChapterId(lesson.chapterId);
    setEditingLessonVideoUrl(lesson.videoUrl || "");
  };

  const handleUpdateLesson = () => {
    setLessons(
      lessons.map((ls) =>
        ls._id === editingLessonId
          ? {
              ...ls,
              title: editingLessonTitle,
              duration: editingLessonDuration,
              chapterId: editingLessonChapterId,
              videoUrl: editingLessonVideoUrl,
            }
          : ls
      )
    );
    setEditingLessonId(null);
    setEditingLessonTitle("");
    setEditingLessonDuration("");
    setEditingLessonChapterId("");
    setEditingLessonVideoUrl("");
  };

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    setReviews(reviews.filter((rv) => rv._id !== reviewId));
  };

  const handleSaveAll = async () => {
    try {
      const benefitsArray = benefits
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const courseDetailArray = courseDetail
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item);

      const newContent = buildContentForDB({
        chapters,
        lessons,
        teacher,
        benefits: benefitsArray,
        courseDetail: courseDetailArray,
        reviews,
        introduction,
      });

      const updateData = {
        title: course.title,
        price: course.price,
        category: course.category,
        thumbnail: course.thumbnail,
        description: course.description,
        duration: course.duration,
        content: newContent,
      };

      const resp = await courseService.updateCourse(courseId, updateData);
      if (resp.status === 200) {
        alert("Đã cập nhật khóa học thành công!");
        setCourse(resp.data.course);
      }
    } catch (err) {
      console.error("Lỗi khi lưu toàn bộ nội dung:", err);
      alert("Có lỗi khi lưu dữ liệu!");
    }
  };

  if (loading) return <p className="p-6">Đang tải chi tiết khóa học...</p>;
  if (!course)
    return <p className="p-6 text-red-500">Không tìm thấy khóa học.</p>;

  return (
    <div className="flex flex-col gap-8 px-6 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {course.title}
          </h1>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-600 text-base">
              Giảng viên: {teacher || "Đang cập nhật"}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Giới thiệu khóa học
            </h2>
            {introduction ? (
              <p className="text-gray-700 text-base">{introduction}</p>
            ) : (
              <p className="text-gray-500">Chưa có thông tin giới thiệu.</p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Bạn sẽ học được những gì?
            </h2>
            {courseDetail.trim() ? (
              <ul className="space-y-2">
                {courseDetail.split("\n").map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-gray-800 text-base"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 flex-shrink-0 text-gray-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12l2 2 4-4"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Chưa có thông tin.</p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Nội dung khóa học
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {chapters.length} chương • {lessons.length} bài học •{" "}
              {course.duration}
            </p>

            {chapters.map((chapter) => {
              const isOpen = expandedChapters.includes(chapter._id);
              return (
                <div
                  key={chapter._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-5"
                >
                  <div
                    onClick={() => toggleChapter(chapter._id)}
                    className="cursor-pointer flex items-center justify-between"
                  >
                    <h3 className="font-medium text-lg text-gray-800">
                      {chapter.title}
                    </h3>
                    <span
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </div>

                  {isOpen && <hr className="my-4 border-t border-gray-200" />}

                  {isOpen && (
                    <ul className="space-y-3 text-gray-700 text-sm">
                      {lessons
                        .filter((ls) => ls.chapterId === chapter._id)
                        .map((ls) => (
                          <li
                            key={ls._id}
                            className="flex items-center gap-2 hover:underline hover:text-blue-600 cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-gray-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <polygon
                                points="10,8 16,12 10,16"
                                fill="currentColor"
                              />
                            </svg>
                            <span className="flex-1">
                              {ls.title} – {ls.duration}
                            </span>
                            <span className="text-sm text-gray-400">
                              {ls.duration}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <CourseSidebar 
          course={course} 
          lessons={lessons} 
          teacher={teacher} 
          slugId={slugId}
        />
      </div>

      {role === "admin" && (
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Quản lý chi tiết khóa học
          </h2>


          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              1. Quản lý Chương
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Thêm chương mới..."
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
              />
              <button
                onClick={handleAddChapter}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors ease-in-out duration-200"
              >
                Thêm Chương
              </button>
            </div>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border border-gray-200">STT</th>
                  <th className="px-4 py-2 border border-gray-200">
                    Tên Chương
                  </th>
                  <th className="px-4 py-2 border border-gray-200">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((ch, index) => (
                  <tr
                    key={ch._id}
                    className="hover:bg-gray-100 transition-colors ease-in-out duration-200"
                  >
                    <td className="px-4 py-2 border border-gray-200 text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {editingChapterId === ch._id ? (
                        <input
                          type="text"
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                          value={editingChapterTitle}
                          onChange={(e) =>
                            setEditingChapterTitle(e.target.value)
                          }
                        />
                      ) : (
                        ch.title
                      )}
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-center space-x-2">
                      {editingChapterId === ch._id ? (
                        <>
                          <button
                            onClick={handleUpdateChapter}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors ease-in-out duration-200"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setEditingChapterId(null);
                              setEditingChapterTitle("");
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition-colors ease-in-out duration-200"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditChapter(ch)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors ease-in-out duration-200"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(ch._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors ease-in-out duration-200"
                          >
                            Xoá
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              2. Quản lý Bài học
            </h3>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Tên bài học..."
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Thời lượng (VD: 10p, 1h20p)..."
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={newLessonDuration}
                onChange={(e) => setNewLessonDuration(e.target.value)}
              />
              <select
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={newLessonChapterId}
                onChange={(e) => setNewLessonChapterId(e.target.value)}
              >
                <option value="">Chọn chương</option>
                {chapters.map((ch) => (
                  <option key={ch._id} value={ch._id}>
                    {ch.title}
                  </option>
                ))}
              </select>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setNewLessonVideoFile(e.target.files[0])}
                className="px-4 py-2"
              />
              <button
                onClick={handleAddLesson}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors ease-in-out duration-200"
              >
                Thêm Bài học
              </button>
            </div>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border border-gray-200">STT</th>
                  <th className="px-4 py-2 border border-gray-200">
                    Tên Bài học
                  </th>
                  <th className="px-4 py-2 border border-gray-200">
                    Thời lượng
                  </th>
                  <th className="px-4 py-2 border border-gray-200">Chương</th>
                  <th className="px-4 py-2 border border-gray-200">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((ls, idx) => (
                  <tr
                    key={ls._id}
                    className="hover:bg-gray-100 transition-colors ease-in-out duration-200"
                  >
                    <td className="px-4 py-2 border border-gray-200 text-center">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {editingLessonId === ls._id ? (
                        <input
                          type="text"
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                          value={editingLessonTitle}
                          onChange={(e) =>
                            setEditingLessonTitle(e.target.value)
                          }
                        />
                      ) : (
                        ls.title
                      )}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {editingLessonId === ls._id ? (
                        <input
                          type="text"
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                          value={editingLessonDuration}
                          onChange={(e) =>
                            setEditingLessonDuration(e.target.value)
                          }
                        />
                      ) : (
                        ls.duration
                      )}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {editingLessonId === ls._id ? (
                        <select
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                          value={editingLessonChapterId}
                          onChange={(e) =>
                            setEditingLessonChapterId(e.target.value)
                          }
                        >
                          {chapters.map((ch) => (
                            <option key={ch._id} value={ch._id}>
                              {ch.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        (chapters.find((ch) => ch._id === ls.chapterId) || {})
                          .title || "Chưa chọn"
                      )}
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-center space-x-2">
                      {editingLessonId === ls._id ? (
                        <>
                          <button
                            onClick={handleUpdateLesson}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors ease-in-out duration-200"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setEditingLessonId(null);
                              setEditingLessonTitle("");
                              setEditingLessonDuration("");
                              setEditingLessonChapterId("");
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition-colors ease-in-out duration-200"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditLesson(ls)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors ease-in-out duration-200"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(ls._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors ease-in-out duration-200"
                          >
                            Xoá
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              3. Quản lý Thông tin bổ sung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">
                  Giới thiệu khóa học:
                </label>
                <textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full h-32"
                  placeholder="Nhập nội dung giới thiệu tổng quan về khóa học..."
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Giảng viên (Teacher):
                </label>
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Benefits (ngăn cách bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
                />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              4. Quản lý "Bạn sẽ học được"
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Nhập nội dung (mỗi dòng là 1 mục):
              </label>
              <textarea
                value={courseDetail}
                onChange={(e) => setCourseDetail(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full h-32"
                placeholder="Ví dụ: Học cách quản lý thời gian&#10;Nâng cao kỹ năng lãnh đạo..."
              />
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              5. Quản lý Đánh giá
            </h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200">
                      Người dùng
                    </th>
                    <th className="px-4 py-2 border border-gray-200">
                      Nội dung
                    </th>
                    <th className="px-4 py-2 border border-gray-200">Số sao</th>
                    <th className="px-4 py-2 border border-gray-200">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rv) => (
                    <tr
                      key={rv._id}
                      className="hover:bg-gray-100 transition-colors ease-in-out duration-200"
                    >
                      <td className="px-4 py-2 border border-gray-200">
                        {rv.userName}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {rv.comment}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {rv.rating}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-center">
                        <button
                          onClick={() => handleDeleteReview(rv._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors ease-in-out duration-200"
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleSaveAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg shadow-md transition-colors ease-in-out duration-200"
            >
              Lưu toàn bộ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
