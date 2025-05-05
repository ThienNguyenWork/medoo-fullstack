import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MainContent = () => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Thêm state để lưu số liệu dashboard
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    ranking: 0,
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
      console.error('Lỗi khi đọc thông tin role từ localStorage:', error);
      setRole('guest');
    } finally {
      setIsLoading(false);
    }
  };

  // Lần đầu load, đọc role và lắng nghe thay đổi từ các tab khác
  useEffect(() => {
    updateRoleFromStorage();
    const handleStorageChange = (e) => {
      if (e.key === 'role') {
        updateRoleFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch số liệu dashboard khi role === 'user'
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/progress/stats/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(response.data);
      } catch (err) {
        console.error('Lỗi tải thống kê:', err);
      }
    };

    if (role === 'user') {
      fetchStats();
    }
  }, [role]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Dashboard cho user
  const renderUserDashboard = () => {
    // Ví dụ dữ liệu 1 khóa học với progress; sản phẩm thực tế bạn sẽ map array courses
    const courseProgressPercent = 1; // lấy từ API course cụ thể

    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Trang cá nhân</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <DashboardCard title="Tổng khóa học" value={stats.totalCourses} />
          <DashboardCard title="Khóa học đã hoàn thành" value={stats.completedCourses} />
          <DashboardCard title="Tổng giờ học" value={stats.totalHours} />
          <DashboardCard title="Xếp hạng" value={stats.ranking} />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Thống kê học tập</h2>
            <div className="flex space-x-2">
              {['Ngày', 'Tuần', 'Tháng', 'Năm', 'Tùy chọn'].map((item) => (
                <button
                  key={item}
                  className="px-3 py-1 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-3xl font-bold text-gray-800">{stats.totalHours} giờ</p>
            <p className="text-sm text-green-500 mt-1">Tiến trình: {Math.round((stats.completedCourses / (stats.totalCourses || 1)) * 100)}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Khóa học của tôi</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-3 text-left">Tên khóa học</th>
                <th className="px-4 py-3 text-left">Ngày tham gia</th>
                <th className="px-4 py-3 text-left">Tiến trình</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-blue-600">Hành Trình Tự Do Tài Chính</td>
                <td className="px-4 py-3">1/4/2025</td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${courseProgressPercent}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
              {/* Kế tiếp bạn có thể map mảng courses từ API để hiển thị nhiều rows */}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

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
          <p>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem dashboard.</p>
        </div>
      )}
    </main>
  );
};

// Component phụ cho thẻ thống kê (Dashboard Card)
const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <p className="text-gray-600 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

export default MainContent;
