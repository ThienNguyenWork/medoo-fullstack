// src/components/DashboardHeader.jsx
import React from 'react';


const DashboardHeader = () => {


 // Hàm xử lý đăng xuất đơn giản
const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    
    // Thông báo đăng xuất thành công (nếu muốn)
    console.log('Đã đăng xuất thành công');
    
    // Delay 1 giây trước khi chuyển hướng
    setTimeout(() => {
      window.location.replace('/auth');
    }, 1000);
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="logo-section">
          <h1>MedSo Dashboard</h1>
        </div>
        
        <nav className="nav-section">
          <ul className="nav-list">
            <li className="nav-item">
              <button className="nav-link">Trang chủ</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Báo cáo</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Cài đặt</button>
            </li>
          </ul>
        </nav>

        <div className="user-section">
          <div className="user-info">
            <span className="username">Admin</span>
            <div className="user-avatar">A</div>
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <style jsx>{`
        .dashboard-header {
          background-color: #2c3e50;
          color: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .logo-section h1 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-item {
          margin: 0 1rem;
        }
        
        .nav-link {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          color: #3498db;
        }
        
        .user-section {
          display: flex;
          align-items: center;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          margin-right: 1rem;
        }
        
        .username {
          margin-right: 0.5rem;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #3498db;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .logout-btn {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .logout-btn:hover {
          background-color: #c0392b;
        }
      `}</style>
    </header>
  );
};

export default DashboardHeader;