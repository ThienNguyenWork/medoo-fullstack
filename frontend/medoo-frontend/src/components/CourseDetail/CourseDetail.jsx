// src/components/CourseDetail/CourseDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  // Định nghĩa fetchCourseDetail với useCallback
  const fetchCourseDetail = useCallback(async () => {
    try {
      const response = await courseService.getCourse(id);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết khoá học:', error);
      setError('Không thể lấy được thông tin khoá học.');
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]); // giờ đây fetchCourseDetail được thêm vào dependency

  if (error) {
    return <p>{error}</p>;
  }
  if (!course) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="course-detail container">
      <h1>{course.title}</h1>
      <img src={course.thumbnail} alt={course.title} style={{ maxWidth: '300px' }} />
      <p>{course.description}</p>
      <p><strong>Giá:</strong> {course.price}</p>
      <p><strong>Danh mục:</strong> {course.category}</p>
      <div>
        <h2>Nội dung khoá học:</h2>
        {course.content && course.content.length > 0 ? (
          <ul>
            {course.content.map((item, index) => (
              <li key={index}>
                <strong>{item.title}</strong> - {item.type}
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có nội dung chi tiết.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
