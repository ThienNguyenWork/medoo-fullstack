// src/components/MainContent.jsx
import React from 'react';

const MainContent = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-screen">
      {/* Phần hiển thị thông tin tổng quan */}
      <div className="max-w-7xl mx-auto">
        
        {/* Vùng hiển thị các thẻ thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white shadow-sm rounded-md">
            <span className="text-gray-600">Tổng khoá học</span>
            <h2 className="text-2xl font-bold">1</h2>
          </div>
          <div className="p-4 bg-white shadow-sm rounded-md">
            <span className="text-gray-600">Số khóa học đã hoàn thành</span>
            <h2 className="text-2xl font-bold">0</h2>
          </div>
          <div className="p-4 bg-white shadow-sm rounded-md">
            <span className="text-gray-600">Tổng giờ học</span>
            <h2 className="text-2xl font-bold">0</h2>
          </div>
          <div className="p-4 bg-white shadow-sm rounded-md">
            <span className="text-gray-600">Xếp hạng</span>
            <h2 className="text-2xl font-bold">0</h2>
          </div>
        </div>

        {/* Bảng thống kê giờ học (có filter Ngày, Tuần, Tháng, Năm, Custom) */}
        <div className="bg-white rounded-md shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Thống kê số giờ học
            </h3>
            {/* Thanh filter */}
            <div className="space-x-2">
              <button className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
                Ngày
              </button>
              <button className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
                Tuần
              </button>
              <button className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
                Tháng
              </button>
              <button className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
                Năm
              </button>
              <button className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
                Custom
              </button>
            </div>
          </div>
          {/* Hiển thị kết quả thống kê */}
          <div className="text-center py-4">
            <p className="text-gray-700 text-xl font-bold">0 giờ</p>
            <p className="text-sm text-green-500">100%</p>
          </div>
        </div>

        {/* Khóa học của tôi */}
        <div className="bg-white rounded-md shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Khóa học của tôi</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="px-4 py-2">Khóa học của bạn</th>
                  <th className="px-4 py-2">Ngày tham gia</th>
                  <th className="px-4 py-2">Tiến trình</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-blue-700">
                    Hành Trình Chinh Phục Con Đường Tự Do Tài Chính
                  </td>
                  <td className="px-4 py-2">1 Th04, 2025</td>
                  <td className="px-4 py-2">1%</td>
                </tr>
                {/* Thêm dữ liệu khác nếu có */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lộ trình đào tạo của tôi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-md shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Lộ trình đào tạo của tôi
            </h3>
            <div className="text-gray-500">
              Dữ liệu hiện đang được cập nhật
            </div>
          </div>

          {/* Kỳ thi sắp diễn ra */}
          <div className="bg-white rounded-md shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Kỳ thi sắp diễn ra
            </h3>
            <div className="text-gray-500">
              Dữ liệu hiện đang được cập nhật
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default MainContent;
