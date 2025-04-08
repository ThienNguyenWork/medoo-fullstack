// src/components/DashboardSidebar.jsx
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="bg-white w-64 h-screen border-r hidden md:flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-blue-600">Menu</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a 
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
            >
              Trang chủ
            </a>
          </li>
          <li>
            <a 
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
            >
              Báo cáo
            </a>
          </li>
          <li>
            <a 
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
            >
              Cài đặt
            </a>
          </li>
          {/* Thêm các menu khác nếu cần */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
