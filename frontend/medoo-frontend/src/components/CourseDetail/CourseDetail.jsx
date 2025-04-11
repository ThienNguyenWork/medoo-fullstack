// src/pages/CourseDetail/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { courseService } from "../../services/api";

const CourseDetail = () => {
  const { slugId } = useParams();
  const courseId = slugId.split("-").pop();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourse(courseId);
        setCourse(response.data.course);
      } catch (error) {
        console.error("Lỗi khi tải khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p className="p-6">Đang tải chi tiết khóa học...</p>;
  if (!course) return <p className="p-6 text-red-500">Không tìm thấy khóa học.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Nội dung bên trái */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-700 text-lg mb-6">{course.description}</p>

        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nội dung khóa học</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            {(course.content && course.content.length > 0) ? (
              course.content.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>Chưa có nội dung cụ thể.</li>
            )}
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Bạn sẽ học được:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            {(course.benefits && course.benefits.length > 0) ? (
              course.benefits.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>Thông tin đang được cập nhật.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Card bên phải */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 h-fit sticky top-4">
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

        <div className="text-sm text-gray-700 space-y-2">
          <div>🧩 {course.content?.length || 0} bài học</div>
          <div>⏱ {course.duration || "2 giờ 32 phút"}</div>
          <div>👨‍🏫 Giảng viên: {course.teacher || "Đang cập nhật"}</div>
          <div>📂 Danh mục: {course.category}</div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
