// src/pages/CourseManagement/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/api';
import { slugify } from '../../utils/slugify';

const CourseManagement = () => {
  const role = localStorage.getItem('role');
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    thumbnail: '',
    // Ta có thêm 1 state tạm thời để nhập JSON content
    contentJson: '[]', 
    content: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khoá học:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // parse content từ contentJson (nếu cần)
      let parsedContent = [];
      try {
        parsedContent = JSON.parse(formData.contentJson);
      } catch (err) {
        console.error('Content không đúng định dạng JSON:', err);
      }

      const dataToSend = {
        ...formData,
        content: parsedContent
      };

      let response;
      if (editingCourseId) {
        response = await courseService.updateCourse(editingCourseId, dataToSend);
        if (response.status === 200) {
          setMessage('✅ Cập nhật khoá học thành công!');
        }
      } else {
        response = await courseService.createCourse(dataToSend);
        if (response.status === 201) {
          setMessage('✅ Tạo khoá học thành công!');
        }
      }

      await fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu khoá học:', error);
      setMessage('❌ Có lỗi xảy ra khi gửi dữ liệu!');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      category: '',
      thumbnail: '',
      contentJson: '[]',
      content: []
    });
    setEditingCourseId(null);
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      thumbnail: course.thumbnail,
      // Stringify content để show lên input
      contentJson: JSON.stringify(course.content || []),
      content: course.content || []
    });
    setEditingCourseId(course._id);
    setMessage("🔧 Đang chỉnh sửa khoá học. Nhấn 'Lưu cập nhật' để xác nhận.");
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá khoá học này không?')) return;
    try {
      await courseService.deleteCourse(id);
      await fetchCourses();
    } catch (error) {
      console.error('Lỗi khi xoá khoá học:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Quản lý khoá học</h1>

      {role === 'admin' && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {editingCourseId ? 'Cập nhật khoá học' : 'Thêm khoá học mới'}
          </h2>
          {message && <p className="mb-4 text-blue-600">{message}</p>}

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
              placeholder="Tên file ảnh (VD: ai-course.jpg)"
              value={formData.thumbnail}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            {/* Thêm phần nhập content dưới dạng JSON */}
            <textarea
              name="contentJson"
              placeholder='[{ "title": "Bài 1", "type": "video", "data": "link-video" }...]'
              value={formData.contentJson}
              onChange={handleChange}
              className="border rounded px-3 py-2 h-32"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              {editingCourseId ? 'Lưu cập nhật' : 'Tạo khoá học'}
            </button>
          </form>
        </div>
      )}

      {/* Phần hiển thị cho user */}
      {role === 'user' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Khóa học nổi bật</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-purple-600 font-bold">
                      {course.price.toLocaleString()} VNĐ
                    </span>
                    <Link
                      to={`/course/${slugify(course.title)}-${course._id}`}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phần hiển thị cho admin (danh sách đã tạo) */}
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
                  <th className="px-4 py-2 border">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td className="px-4 py-2 border">{course.title}</td>
                    <td className="px-4 py-2 border">{course.description}</td>
                    <td className="px-4 py-2 border">{course.price.toLocaleString()}</td>
                    <td className="px-4 py-2 border">{course.category}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                      >
                        Sửa
                      </button>
                      <Link
                        to={`/course/${slugify(course.title)}-${course._id}`}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                      >
                        Xem
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                      >
                        Xoá
                      </button>
                    </td>
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
