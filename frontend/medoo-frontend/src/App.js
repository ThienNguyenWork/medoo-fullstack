import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import ContactUs from './pages/ContactUs';
import Hero from './components/Homepage/Hero';
import ContentSlider from './components/Homepage/ContentSlider';
import AIEducationSection from './components/Homepage/AIEducationSection'
import NFTCollaborationSection from './components/Homepage/NFTCollaborationSection'
import RoadmapSlider from './components/Homepage/RoadmapSlider'
import AwardsSection from './components/Homepage/AwardsSection'
import CourseManagement from './pages/CourseManagement/CourseManagement';
import CourseDetail from './components/CourseDetail/CourseDetail';
import CourseLearning from "./components/CourseDetail/CourseLearning";
import PaymentPage from './pages/PaymentPage';
import AuthPage from './pages/userAuth';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import CSS AOS
import './App.css';
import Dashboard from './pages/Dashboard'; // Đảm bảo bạn đã tạo component này

// Khởi tạo AOS
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
});

function App() {
  // State để theo dõi trạng thái xác thực
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State để theo dõi quá trình tải
  const [loading, setLoading] = useState(true);

  // Kiểm tra xác thực khi component được tải
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Hàm kiểm tra xác thực đã được sửa
const checkAuthentication = async () => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('token');
  
  console.log("Checking authentication, token exists:", !!token);
  
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

    const data = await response.json();
    console.log("Token validation response:", response.status, data);

    // Xử lý kết quả
    if (response.ok) {
      if (data.success) {
        // Token hợp lệ
        setIsAuthenticated(true);
      } else {
        // Token không hợp lệ theo server
        console.warn('Token validation failed:', data.message);
        // KHÔNG xóa token nếu server chỉ báo không hợp lệ tạm thời
        setIsAuthenticated(false);
      }
    } else {
      // Lỗi kết nối hoặc server
      console.warn('Token validation request failed:', response.status);
      
      // Quan trọng: KHÔNG reset isAuthenticated thành false khi có lỗi kết nối
      // Cho phép người dùng tiếp tục sử dụng token hiện tại
      if (response.status === 401) {
        // Chỉ khi server rõ ràng từ chối token mới đăng xuất
        console.log("Server rejected token with 401, logging out");
        setIsAuthenticated(false);
      } else {
        // Giữ người dùng đăng nhập nếu chỉ là lỗi kết nối hoặc server
        console.log("Connection error but keeping user logged in");
        setIsAuthenticated(true);
      }
    }
  } catch (error) {
    // Lỗi mạng hoặc khác
    console.error('Auth check error:', error);
    // Quan trọng: Giữ trạng thái đăng nhập nếu là lỗi mạng
    console.log("Network error but keeping user logged in");
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

  // Trong return statement của App component:
return (
  <BrowserRouter>
    <Routes>
      {/* Route đăng nhập - với logic cải tiến */}
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
            <ContentSlider />
            <AIEducationSection />
            <NFTCollaborationSection />
            <RoadmapSlider />
            <AwardsSection />
            <Footer />
          </>
        }
        
      />
      
      {/* Route dashboard với cơ chế fallback */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated || localStorage.getItem('token') ? (
            <>
              <Header isAuthenticated={true} onLogout={handleLogout} />
              <Dashboard />
            </>
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
     <Route 
  path="/course-management" 
  element={
    isAuthenticated || localStorage.getItem('token') ? (
      <>
        <Header isAuthenticated={true} onLogout={handleLogout} />
        <CourseManagement />
      </>
    ) : (
      <Navigate to="/auth" replace />
    )
  } 
/>

<Route 
  path="/course/:slugId" 
  element={
    isAuthenticated || localStorage.getItem('token') ? (
      <>
        <Header isAuthenticated={true} onLogout={handleLogout} />
        <CourseDetail />
      </>
    ) : (
      <Navigate to="/auth" replace />
    )
  } 
/>
<Route
  path="/course/:slugId/learning"
  element={
    isAuthenticated ? (
      <>
        <Header isAuthenticated={true} onLogout={handleLogout} />
        <CourseLearning />
      </>
    ) : (
      <Navigate to="/auth" replace />
    )
  }
/>
<Route path="/course/:slugId/payment" element={<PaymentPage />} />
  {/* Route cho trang Contact Us */}
  <Route path="/contact" element={<ContactUs />} />
      {/* Route mặc định - chuyển hướng về trang chủ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
}

export default App;