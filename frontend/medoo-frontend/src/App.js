import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import AuthPage from './pages/userAuth';
import Dashboard from './pages/Dashboard'; // Đảm bảo bạn đã tạo component này

function App() {
  // State để theo dõi trạng thái xác thực
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State để theo dõi quá trình tải
  const [loading, setLoading] = useState(true);

  // Kiểm tra xác thực khi component được tải
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Hàm kiểm tra xác thực
  const checkAuthentication = async () => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Nếu không có token, không cần kiểm tra thêm
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      // Gọi API để kiểm tra token
      const response = await fetch('http://localhost:5001/api/users/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Xử lý kết quả
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Token hợp lệ
          setIsAuthenticated(true);
        } else {
          // Token không hợp lệ theo server
          console.warn('Token validation failed:', data.message);
          setIsAuthenticated(false);
        }
      } else {
        // Lỗi kết nối hoặc server
        console.warn('Token validation request failed:', response.status);
        // Vẫn giữ trạng thái đăng nhập nếu chỉ là lỗi kết nối
        // Chỉ đăng xuất nếu server rõ ràng báo token không hợp lệ
        if (response.status === 401) {
          setIsAuthenticated(false);
        } else {
          // Giả định rằng người dùng vẫn đăng nhập nếu không phải lỗi 401
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      // Lỗi mạng hoặc khác
      console.error('Auth check error:', error);
      // Giả định rằng người dùng vẫn đăng nhập nếu là lỗi mạng
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý đăng nhập thành công
  const handleLoginSuccess = (token) => {
    console.log('Login success, token received:', !!token);
    // Đặt trạng thái xác thực thành true
    setIsAuthenticated(true);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    // Đặt trạng thái xác thực thành false
    setIsAuthenticated(false);
  };

  // Hiển thị loader khi đang kiểm tra xác thực
  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  // Render giao diện chính
  return (
    <BrowserRouter>
      <Routes>
        {/* Route đăng nhập */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <AuthPage onLoginSuccess={handleLoginSuccess} />
          } 
        />
        
        {/* Route trang chủ */}
        <Route 
          path="/" 
          element={
            <>
              <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
              <Hero />
            </>
          }
        />
        
        {/* Route dashboard (bảo vệ bởi xác thực) */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <>
                <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        
        {/* Route mặc định - chuyển hướng về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Có thể thêm thông báo toàn cục ở đây nếu cần */}
    </BrowserRouter>
  );
}

export default App;