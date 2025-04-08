// src/components/DashboardHeader.jsx
import React, { useState, useEffect } from 'react';
const API_BASE_URL = 'http://localhost:5001/api';

const DashboardHeader = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Kiểm tra username trong localStorage khi component mount
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Nếu không có, gọi API để lấy thông tin user
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
            localStorage.setItem('username', data.username);
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin user:', error);
        }
      };

      fetchUserData();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.replace('/auth');
  };

  return (
    <header className="bg-blue-900 text-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & tiêu đề */}
        <div className="text-xl font-bold">
          MedSo Dashboard
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <button className="hover:text-blue-300 transition-colors">
                Trang chủ
              </button>
            </li>
            <li>
              <button className="hover:text-blue-300 transition-colors">
                Báo cáo
              </button>
            </li>
            <li>
              <button className="hover:text-blue-300 transition-colors">
                Cài đặt
              </button>
            </li>
          </ul>
        </nav>

        {/* User section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm">
              Xin chào <span className="text-blue-300 font-semibold">@{username || 'Khách'}</span>
            </span>
            <div className="w-8 h-8 ml-2 bg-green-500 rounded-full flex items-center justify-center text-lg font-bold">
              {username ? username[0].toUpperCase() : 'A'}
            </div>
          </div>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
