import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MainContent = () => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCourses: 0,
      completedCourses: 0,
      totalHours: 0,
      ranking: 0
    },
    courses: [],
    loading: true
  });

  // Hàm cập nhật role từ localStorage
  const updateRoleFromStorage = () => {
    try {
      const storedRole = localStorage.getItem('role');
      if (storedRole === 'admin' || storedRole === 'user') {
        setRole(storedRole);
      } else {
        setRole('guest');
      }
    } catch (error) {
      console.error('Lỗi khi đọc thông tin role:', error);
      setRole('guest');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateRoleFromStorage();
    const handleStorageChange = (e) => {
      if (e.key === 'role') updateRoleFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch dữ liệu dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, progressRes] = await Promise.all([
          axios.get('/api/progress/stats/dashboard', {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
          }),
          axios.get('/api/progress', {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
          })
        ]);
  
        // Xử lý dữ liệu courses theo response mới từ API
        const coursesData = Array.isArray(progressRes.data) 
          ? progressRes.data.map(course => ({
              ...course,
              startDate: course.startDate || new Date().toISOString()
            }))
          : [];
  
        setDashboardData({
          stats: statsRes.data,
          courses: coursesData,
          loading: false
        });
  
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false
        }));
      }
    };
  
    if (role === 'user') fetchDashboardData();
  }, [role]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render dashboard cho user
  const renderUserDashboard = () => (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Trang cá nhân</h1>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Tổng khóa học" value={dashboardData.stats.totalCourses} />
        <DashboardCard title="Hoàn thành" value={dashboardData.stats.completedCourses} />
        <DashboardCard title="Tổng giờ học" value={dashboardData.stats.totalHours} />
        <DashboardCard title="Xếp hạng" value={dashboardData.stats.ranking} />
      </div>

      {/* Danh sách khóa học */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Khóa học của tôi</h2>
        
        {dashboardData.loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-3 text-left min-w-[300px]">Khóa học</th>
                  <th className="px-4 py-3 text-left">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-left">Tiến trình</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.courses.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      Bạn chưa tham gia khóa học nào
                    </td>
                  </tr>
                ) : (
                  dashboardData.courses.map((course) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <img
                            src={course.thumbnail || '/default-thumbnail.jpg'}
                            alt="Thumbnail"
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                            onError={(e) => {
                              e.target.src = '/default-thumbnail.jpg';
                            }}
                          />
                          <span className="font-medium text-gray-800">
                            {course.title || 'Khóa học không có tiêu đề'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(course.startDate).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-32 mr-2">
                            <div className="bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${course.progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {course.progressPercent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Dashboard cho admin
  const renderAdminDashboard = () => (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Bảng điều khiển quản trị</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Tổng người dùng" value="125" />
        <DashboardCard title="Khóa học đang hoạt động" value="8" />
        <DashboardCard title="Doanh thu tháng" value="$3,240" />
        <DashboardCard title="Lượt truy cập" value="1,024" />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            + Thêm người dùng
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Tên</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">Admin User</td>
                <td className="px-4 py-3">admin@example.com</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Admin
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">Sửa</button>
                  <button className="text-red-600 hover:text-red-800">Xóa</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">Người dùng thường</td>
                <td className="px-4 py-3">user@example.com</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    User
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">Sửa</button>
                  <button className="text-red-600 hover:text-red-800">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-screen">
      <div className={role !== 'admin' ? 'hidden' : ''}>
        {renderAdminDashboard()}
      </div>
      <div className={role !== 'user' ? 'hidden' : ''}>
        {renderUserDashboard()}
      </div>
      {role === 'guest' && (
        <div className="text-center text-gray-600 mt-10">
          <p>Vui lòng đăng nhập để xem dashboard</p>
        </div>
      )}
    </main>
  );
};

const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <p className="text-gray-600 text-sm mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </h3>
  </div>
);

export default MainContent;
