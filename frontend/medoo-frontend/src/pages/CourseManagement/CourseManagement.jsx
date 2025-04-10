// src/pages/CourseManagement/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/api';

const CourseManagement = () => {
  const role = localStorage.getItem('role');
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    thumbnail: '',
    content: [],
  });

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu khoá học:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await courseService.createCourse(formData);
      if (response.status === 201) {
        setMessage('✅ Tạo khoá học thành công!');
        fetchCourses();
        setFormData({
          title: '',
          description: '',
          price: 0,
          category: '',
          thumbnail: '',
          content: [],
        });
      }
    } catch (error) {
      console.error('Lỗi khi tạo khoá học:', error);
      if (error.response) {
        console.log('Chi tiết lỗi từ backend:', error.response.data);
      }
      setMessage('❌ Có lỗi xảy ra khi tạo khoá học!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Quản lý khoá học</h1>

      {/* ADMIN VIEW */}
      {role === 'admin' && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Thêm khoá học mới</h2>
          {message && <p className="mb-4 text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              name="title"
              placeholder="Tiêu đề"
              value={formData.title}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <textarea
              name="description"
              placeholder="Mô tả"
              value={formData.description}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Giá (VNĐ)"
              value={formData.price}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Danh mục"
              value={formData.category}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              name="thumbnail"
              placeholder="Thumbnail URL"
              value={formData.thumbnail}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Tạo khoá học
            </button>
          </form>
        </div>
      )}

      {/* USER VIEW */}
      {role === 'user' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Danh sách khoá học</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-2">{course.description}</p>
                <p className="text-sm text-purple-700 font-semibold mb-2">Giá: {course.price.toLocaleString()} VNĐ</p>
                <Link
                  to={`/course/${course._id}`}
                  className="inline-block text-purple-600 hover:underline"
                >
                  Xem chi tiết →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN COURSE TABLE */}
      {role === 'admin' && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Danh sách khoá học đã tạo</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Tiêu đề</th>
                  <th className="px-4 py-2 border">Mô tả</th>
                  <th className="px-4 py-2 border">Giá</th>
                  <th className="px-4 py-2 border">Danh mục</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id}>
                    <td className="px-4 py-2 border">{course.title}</td>
                    <td className="px-4 py-2 border">{course.description}</td>
                    <td className="px-4 py-2 border">{course.price.toLocaleString()}</td>
                    <td className="px-4 py-2 border">{course.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
