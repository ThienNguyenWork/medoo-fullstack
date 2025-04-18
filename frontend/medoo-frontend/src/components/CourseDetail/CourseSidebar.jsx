//Components/CourseDetail/CourseSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseSidebar = ({ course, lessons, teacher, slugId }) => {
  const navigate = useNavigate();

  return (
    <div className="md:col-span-1">
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 sticky top-4 cursor-pointer hover:shadow-2xl transition-shadow duration-300">
        <img
          src={course.thumbnail || "https://via.placeholder.com/300x200"}
          alt="Course Thumbnail"
          className="rounded-xl mb-6 w-full h-48 object-cover"
        />
        <p className="text-2xl font-bold text-purple-600 mb-4">
          {course.price?.toLocaleString()} VNĐ
        </p>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold w-full py-3 rounded-xl shadow-md transition-colors ease-in-out duration-200 mb-6"
          onClick={() => {
            navigate(`/course/${slugId}/learning`);
          }}
        >
          Mua ngay
        </button>
        <div className="text-sm text-gray-700 space-y-1">
          <div>🧩 {lessons.length} bài học</div>
          <div>⏱ {course.duration}</div>
          <div>👨🏫 Giảng viên: {teacher || "Đang cập nhật"}</div>
          <div>📂 Danh mục: {course.category}</div>
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;