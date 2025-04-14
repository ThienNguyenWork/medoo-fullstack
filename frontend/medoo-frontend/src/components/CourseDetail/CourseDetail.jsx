// components/CourseDetail/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { courseService } from "../../services/api";
import { slugify } from "../../utils/slugify";

// Hàm parse: tách mảng content thành các state riêng
function parseContentFromDB(contentArray) {
  let chapters = [];
  let lessons = [];
  let teacher = "";
  let benefits = [];
  let courseDetail = [];
  let reviews = [];
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
      default:
        break;
    }
  });
  return { chapters, lessons, teacher, benefits, courseDetail, reviews };
}

// Hàm build: gom lại các state thành mảng content duy nhất
function buildContentForDB({ chapters, lessons, teacher, benefits, courseDetail, reviews }) {
  return [
    { blockType: "chapters", data: chapters },
    { blockType: "lessons", data: lessons },
    { blockType: "teacher", data: teacher },
    { blockType: "benefits", data: benefits },
    { blockType: "courseDetail", data: courseDetail },
    { blockType: "reviews", data: reviews },
  ];
}

const CourseDetail = () => {
  const { slugId } = useParams();
  const role = localStorage.getItem("role") || "user";
  const courseId = slugId.split("-").pop();

  // Các state ngoài content (các trường chung của khóa học)
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Các state được tách ra từ mảng content
  const [chapters, setChapters] = useState([]);   // Quản lý chương
  const [lessons, setLessons] = useState([]);       // Quản lý bài học
  const [teacher, setTeacher] = useState("");       // Giảng viên
  const [benefits, setBenefits] = useState("");     // Nhập dưới dạng chuỗi, ngăn cách bởi dấu phẩy
  const [courseDetail, setCourseDetail] = useState(""); // Nhập dưới dạng chuỗi, mỗi dòng là 1 mục
  const [reviews, setReviews] = useState([]);       // Đánh giá

  // ----- State tạm cho thao tác Quản lý CHƯƠNG -----
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState("");

  // ----- State tạm cho thao tác Quản lý BÀI HỌC -----
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("");
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState("");
  const [editingLessonDuration, setEditingLessonDuration] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourse(courseId);
        const fetchedCourse = response.data.course;
        setCourse(fetchedCourse);
        // Ở DB, mọi dữ liệu riêng đã được gộp vào mảng content
        const { chapters, lessons, teacher, benefits, courseDetail, reviews } =
          parseContentFromDB(fetchedCourse.content || []);
        setChapters(chapters);
        setLessons(lessons);
        setTeacher(teacher);
        setBenefits(benefits.join(", ")); // hiển thị dưới dạng chuỗi
        setCourseDetail(courseDetail.join("\n")); // hiển thị dưới dạng chuỗi (mỗi dòng)
        setReviews(reviews);
      } catch (error) {
        console.error("Lỗi khi tải khóa học:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // --- Các hàm xử lý cho Admin ---

  // 1. Quản lý Chương
  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newChap = { _id: Date.now().toString(), title: newChapterTitle };
    setChapters([...chapters, newChap]);
    setNewChapterTitle("");
  };

  const handleDeleteChapter = (chapterId) => {
    if (!window.confirm("Bạn có chắc muốn xóa chương này?")) return;
    setChapters(chapters.filter((ch) => ch._id !== chapterId));
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

  // 2. Quản lý Bài học
  const handleAddLesson = () => {
    if (!newLessonTitle.trim()) return;
    const newLesson = {
      _id: Date.now().toString(),
      title: newLessonTitle,
      duration: newLessonDuration,
      // Nếu cần liên kết với chương, bạn có thể thêm trường chapterId ở đây
    };
    setLessons([...lessons, newLesson]);
    setNewLessonTitle("");
    setNewLessonDuration("");
  };

  const handleDeleteLesson = (lessonId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài học này?")) return;
    setLessons(lessons.filter((ls) => ls._id !== lessonId));
  };

  const startEditLesson = (lesson) => {
    setEditingLessonId(lesson._id);
    setEditingLessonTitle(lesson.title);
    setEditingLessonDuration(lesson.duration);
  };

  const handleUpdateLesson = () => {
    setLessons(
      lessons.map((ls) =>
        ls._id === editingLessonId
          ? { ...ls, title: editingLessonTitle, duration: editingLessonDuration }
          : ls
      )
    );
    setEditingLessonId(null);
    setEditingLessonTitle("");
    setEditingLessonDuration("");
  };

  // 3. Quản lý Thông tin bổ sung (Teacher, Benefits)  
  // Khi chỉnh sửa, onChange sẽ cập nhật state; không cần nút "Lưu" riêng
  // (Bạn có thể hiển thị nút “Lưu thông tin bổ sung” nếu muốn cập nhật riêng, nhưng nó sẽ chỉ gán lại giá trị vào state – ở đây các input đã luôn cập nhật)

  // 4. Quản lý "Bạn sẽ học được"  
  // Tương tự: giá trị của textarea luôn cập nhật vào state courseDetail

  // 5. Quản lý Đánh giá  
  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    setReviews(reviews.filter((rv) => rv._id !== reviewId));
  };

  // --- Nút Lưu TOÀN BỘ ---  
  // Khi admin nhấn nút "Lưu toàn bộ", các state hiện tại được gom lại thành mảng content và gửi cập nhật
  const handleSaveAll = async () => {
    try {
      // Chuyển benefits và courseDetail từ chuỗi sang mảng
      const benefitsArray = benefits
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const courseDetailArray = courseDetail
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item);
      // Build mảng content từ các state
      const newContent = buildContentForDB({
        chapters,
        lessons,
        teacher,
        benefits: benefitsArray,
        courseDetail: courseDetailArray,
        reviews,
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
  if (!course) return <p className="p-6 text-red-500">Không tìm thấy khóa học.</p>;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* PHẦN THÔNG TIN TỔNG QUAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái (2/3) */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-600">
              Giảng viên: {teacher || "Đang cập nhật"}
            </span>
          </div>
          <p className="text-gray-700 text-base mb-6">{course.description}</p>

          {/* Hiển thị "Bạn sẽ học được" */}
          <div className="bg-white shadow-md rounded-xl p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Bạn sẽ học được những gì?</h2>
            {courseDetail.trim() ? (
              <ul className="list-disc ml-5 space-y-1">
                {courseDetail.split("\n").map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Chưa có thông tin.</p>
            )}
          </div>

          {/* Nội dung khóa học (Quản lý Chương & Bài học) */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">Nội dung khóa học</h2>
            <p className="text-sm text-gray-500 mb-2">
              {chapters.length} chương • {lessons.length} bài học • {course.duration}
            </p>
            {chapters.map((chapter) => (
              <div key={chapter._id} className="mb-4">
                <h3 className="font-semibold text-md mb-1">• {chapter.title}</h3>
                <ul className="pl-4 list-disc text-gray-700 text-sm">
                  {lessons
                    .filter((ls) => ls.chapterId === chapter._id)
                    .map((ls) => (
                      <li key={ls._id}>
                        {ls.title} - {ls.duration}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 sticky top-4">
            <img
              src={course.thumbnail || "https://via.placeholder.com/300x200"}
              alt="Course Thumbnail"
              className="rounded-xl mb-4 w-full h-48 object-cover"
            />
            <p className="text-2xl font-bold text-purple-600 mb-3">
              {course.price?.toLocaleString()} VNĐ
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold w-full py-2 rounded-xl mb-5">
              Mua ngay
            </button>
            <div className="text-sm text-gray-700 space-y-1">
              <div>🧩 {lessons.length} bài học</div>
              <div>⏱ {course.duration}</div>
              <div>👨‍🏫 Giảng viên: {teacher || "Đang cập nhật"}</div>
              <div>📂 Danh mục: {course.category}</div>
              <div>Slug: {slugify(course.title)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* PHẦN QUẢN TRỊ (Admin) */}
      {role === "admin" && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Quản lý chi tiết khóa học</h2>

          {/* 1. Quản lý Chương */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">1. Quản lý Chương</h3>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Thêm chương mới..."
                className="border rounded px-3 py-1"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
              />
              <button
                onClick={handleAddChapter}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Thêm Chương
              </button>
            </div>
            <table className="min-w-full border">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 border-r">STT</th>
                  <th className="px-4 py-2 border-r">Tên Chương</th>
                  <th className="px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((ch, index) => (
                  <tr key={ch._id} className="border-b">
                    <td className="px-4 py-2 border-r text-center">{index + 1}</td>
                    <td className="px-4 py-2 border-r">
                      {editingChapterId === ch._id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={editingChapterTitle}
                          onChange={(e) => setEditingChapterTitle(e.target.value)}
                        />
                      ) : (
                        ch.title
                      )}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      {editingChapterId === ch._id ? (
                        <>
                          <button
                            onClick={handleUpdateChapter}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setEditingChapterId(null);
                              setEditingChapterTitle("");
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditChapter(ch)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(ch._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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

          {/* 2. Quản lý Bài học */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">2. Quản lý Bài học</h3>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Tên bài học..."
                className="border rounded px-3 py-1"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Thời lượng (VD: 10p, 1h20p)..."
                className="border rounded px-3 py-1"
                value={newLessonDuration}
                onChange={(e) => setNewLessonDuration(e.target.value)}
              />
              <button
                onClick={handleAddLesson}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Thêm Bài học
              </button>
            </div>
            <table className="min-w-full border">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 border-r">STT</th>
                  <th className="px-4 py-2 border-r">Tên Bài học</th>
                  <th className="px-4 py-2 border-r">Thời lượng</th>
                  <th className="px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((ls, idx) => (
                  <tr key={ls._id} className="border-b">
                    <td className="px-4 py-2 border-r text-center">{idx + 1}</td>
                    <td className="px-4 py-2 border-r">
                      {editingLessonId === ls._id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={editingLessonTitle}
                          onChange={(e) => setEditingLessonTitle(e.target.value)}
                        />
                      ) : (
                        ls.title
                      )}
                    </td>
                    <td className="px-4 py-2 border-r">
                      {editingLessonId === ls._id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={editingLessonDuration}
                          onChange={(e) => setEditingLessonDuration(e.target.value)}
                        />
                      ) : (
                        ls.duration
                      )}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      {editingLessonId === ls._id ? (
                        <>
                          <button
                            onClick={handleUpdateLesson}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setEditingLessonId(null);
                              setEditingLessonTitle("");
                              setEditingLessonDuration("");
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditLesson(ls)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(ls._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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

          {/* 3. Quản lý Thông tin bổ sung (Teacher, Benefits) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">3. Quản lý Thông tin bổ sung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Giảng viên (Teacher):</label>
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="border rounded px-3 py-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Benefits (ngăn cách bởi dấu phẩy):</label>
                <input
                  type="text"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="border rounded px-3 py-1 w-full"
                />
              </div>
            </div>
            {/* Không cần nút riêng cho lưu phần này; giá trị được cập nhật qua onChange */}
          </div>

          {/* 4. Quản lý "Bạn sẽ học được" */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">4. Quản lý "Bạn sẽ học được"</h3>
            <div className="mb-4">
              <label className="block mb-1">
                Nhập nội dung (mỗi dòng là 1 mục):
              </label>
              <textarea
                value={courseDetail}
                onChange={(e) => setCourseDetail(e.target.value)}
                className="border rounded px-3 py-1 w-full h-32"
                placeholder="Ví dụ: Học cách quản lý thời gian&#10;Nâng cao kỹ năng lãnh đạo..."
              />
            </div>
            {/* Không cần nút lưu riêng; onChange cập nhật state */}
          </div>

          {/* 5. Quản lý Đánh giá */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">5. Quản lý Đánh giá</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
              <table className="min-w-full border">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2 border-r">Người dùng</th>
                    <th className="px-4 py-2 border-r">Nội dung</th>
                    <th className="px-4 py-2 border-r">Số sao</th>
                    <th className="px-4 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rv) => (
                    <tr key={rv._id} className="border-b">
                      <td className="px-4 py-2 border-r">{rv.userName}</td>
                      <td className="px-4 py-2 border-r">{rv.comment}</td>
                      <td className="px-4 py-2 border-r">{rv.rating}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDeleteReview(rv._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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

          {/* Nút "Lưu toàn bộ" để cập nhật tất cả các nội dung vào DB */}
          <div className="text-center">
            <button
              onClick={handleSaveAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
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
