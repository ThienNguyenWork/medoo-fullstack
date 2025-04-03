import React, { useState } from 'react';
import './Header.css';
import { FaSearch, FaShoppingCart, FaBell, FaUser, FaAngleDown } from 'react-icons/fa';
import logo from '../assets/medoo-logo.png';

const Header = () => {
  const [language, setLanguage] = useState('Tiếng Việt');
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState({
    courses: false,
    lms: false,
    about: false
  });

  const toggleLanguage = () => {
    setShowLanguageOptions(!showLanguageOptions);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageOptions(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement actual search functionality here
    setShowSearch(false);
  };

  const toggleDropdown = (menu) => {
    setShowDropdown({
      ...showDropdown,
      [menu]: !showDropdown[menu]
    });
  };

  const handleConnectWallet = () => {
    console.log('Connecting wallet...');
    // Implement wallet connection logic here
    alert('Wallet connection feature will be implemented soon!');
  };

  return (
    <header className="header">
      <div className="top-bar">
        <p className="support-text">
          Chúng tôi chính thức hỗ trợ người dùng web3 học tập và xây dựng nội dung trên nền tảng medoo.
        </p>
        <div className="top-right">
          <div className="search-container" onClick={toggleSearch}>
            <FaSearch className="search-icon" />
            <span>{showSearch ? 'Đóng' : 'Tìm kiếm'}</span>
          </div>
          
          {showSearch && (
            <div className="search-dropdown">
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Tìm</button>
              </form>
            </div>
          )}
          
          <div className="language-selector" onClick={toggleLanguage}>
            <span>{language}</span>
            <FaAngleDown />
            
            {showLanguageOptions && (
              <div className="language-dropdown">
                <div onClick={() => changeLanguage('Tiếng Việt')}>Tiếng Việt</div>
                <div onClick={() => changeLanguage('English')}>English</div>
              </div>
            )}
          </div>
          
          <button className="connect-btn" onClick={handleConnectWallet}>
            <span>Kết nối ví</span>
          </button>
        </div>
      </div>

      <div className="main-nav">
        <div className="nav-left">
          <div className="logo-container">
            <img src={logo} alt="Medoo Logo" className="logo" />
          </div>
          <nav className="nav-links">
            <div 
              className="nav-item" 
              onMouseEnter={() => toggleDropdown('courses')}
              onMouseLeave={() => toggleDropdown('courses')}
            >
              <span>Khóa Học</span>
              <FaAngleDown />
              
              {showDropdown.courses && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">Blockchain cơ bản</div>
                  <div className="dropdown-item">DeFi</div>
                  <div className="dropdown-item">NFT</div>
                  <div className="dropdown-item">Web3 Development</div>
                </div>
              )}
            </div>
            <div className="nav-item">
              <span>Kiếm Tiền</span>
            </div>
            <div className="nav-item">
              <span>Airdrop</span>
            </div>
            <div className="nav-item">
              <span>Luyện Thi</span>
            </div>
            <div 
              className="nav-item"
              onMouseEnter={() => toggleDropdown('lms')}
              onMouseLeave={() => toggleDropdown('lms')}
            >
              <span>LMS và Dịch Vụ</span>
              <FaAngleDown />
              
              {showDropdown.lms && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">LMS cho doanh nghiệp</div>
                  <div className="dropdown-item">Giải pháp giáo dục</div>
                  <div className="dropdown-item">Tư vấn triển khai</div>
                </div>
              )}
            </div>
            <div className="nav-item">
              <span>Báo giá</span>
            </div>
            <div 
              className="nav-item"
              onMouseEnter={() => toggleDropdown('about')}
              onMouseLeave={() => toggleDropdown('about')}
            >
              <span>Về Medoo</span>
              <FaAngleDown />
              
              {showDropdown.about && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">Giới thiệu</div>
                  <div className="dropdown-item">Đội ngũ</div>
                  <div className="dropdown-item">Blog</div>
                  <div className="dropdown-item">Liên hệ</div>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="nav-right">
          <div className="icon-container" onClick={() => alert('Giỏ hàng sẽ được triển khai sớm!')}>
            <FaShoppingCart className="nav-icon" />
          </div>
          <div className="icon-container" onClick={() => alert('Thông báo sẽ được triển khai sớm!')}>
            <FaBell className="nav-icon" />
          </div>
          <div className="user-avatar" onClick={() => alert('Tính năng tài khoản sẽ được triển khai sớm!')}>
            <FaUser className="avatar-placeholder" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;