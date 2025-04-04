import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaBell, FaUser, FaAngleDown, FaBars, FaTimes } from 'react-icons/fa';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setShowLanguageOptions(!showLanguageOptions);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageOptions(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
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
    alert('Wallet connection feature will be implemented soon!');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (showSearch) setShowSearch(false);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center py-2 px-4 md:px-12 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-600 text-center md:text-left mb-2 md:mb-0 px-4 md:px-0">
          Chúng tôi chính thức hỗ trợ người dùng web3 học tập và xây dựng nội dung trên nền tảng medoo.
        </p>
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search */}
          <div className="relative flex items-center gap-2 cursor-pointer" onClick={toggleSearch}>
            <FaSearch className="text-gray-500 text-sm" />
            <span className="text-sm hidden md:inline">{showSearch ? 'Đóng' : 'Tìm kiếm'}</span>
            
            {showSearch && (
              <div className="absolute top-8 right-0 bg-white rounded shadow-lg p-3 z-30 w-64">
                <form onSubmit={handleSearch}>
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                  <button 
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded px-3 py-1.5 float-right"
                  >
                    Tìm
                  </button>
                </form>
              </div>
            )}
          </div>
          
          {/* Language Selector */}
          <div className="relative flex items-center gap-1 cursor-pointer font-medium" onClick={toggleLanguage}>
            <span className="text-sm">{language}</span>
            <FaAngleDown className="text-xs" />
            
            {showLanguageOptions && (
              <div className="absolute top-8 right-0 bg-white rounded shadow-lg z-30 min-w-32">
                <div 
                  className="py-2 px-4 text-sm hover:bg-gray-50 cursor-pointer" 
                  onClick={() => changeLanguage('Tiếng Việt')}
                >
                  Tiếng Việt
                </div>
                <div 
                  className="py-2 px-4 text-sm hover:bg-gray-50 cursor-pointer" 
                  onClick={() => changeLanguage('English')}
                >
                  English
                </div>
              </div>
            )}
          </div>
          
          {/* Connect Wallet Button */}
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full py-1 px-4 text-sm flex items-center gap-1 transition-colors"
            onClick={handleConnectWallet}
          >
            <span>Kết nối ví</span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex justify-between items-center py-3 px-4 md:px-12">
        {/* Logo and Nav Links (Left Side) */}
        <div className="flex items-center">
          <div className="w-24 md:w-28 mr-5 md:mr-10">
            <img src={logo} alt="Medoo Logo" className="w-full h-auto" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {/* Courses Dropdown */}
            <div 
              className="relative flex items-center gap-1 cursor-pointer font-medium text-gray-800 hover:text-purple-600 py-1"
              onMouseEnter={() => toggleDropdown('courses')}
              onMouseLeave={() => toggleDropdown('courses')}
            >
              <span>Khóa Học</span>
              <FaAngleDown className="text-xs" />
              
              {showDropdown.courses && (
                <div className="absolute top-full left-0 bg-white rounded shadow-lg z-20 min-w-44 py-1">
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    Blockchain cơ bản
                  </div>
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    DeFi
                  </div>
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    NFT
                  </div>
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    Web3 Development
                  </div>
                </div>
              )}
            </div>
            
            {/* Simple Nav Items */}
            <div className="cursor-pointer font-medium text-gray-800 hover:text-purple-600 py-1">
              <span>Kiếm Tiền</span>
            </div>
            <div className="cursor-pointer font-medium text-gray-800 hover:text-purple-600 py-1">
              <span>Airdrop</span>
            </div>
            <div className="cursor-pointer font-medium text-gray-800 hover:text-purple-600 py-1">
              <span>Luyện Thi</span>
            </div>
            
            {/* LMS Dropdown */}
            <div 
              className="relative flex items-center gap-1 cursor-pointer font-medium text-gray-800 hover:text-purple-600 py-1"
              onMouseEnter={() => toggleDropdown('lms')}
              onMouseLeave={() => toggleDropdown('lms')}
            >
              <span>LMS và Dịch Vụ</span>
              <FaAngleDown className="text-xs" />
              
              {showDropdown.lms && (
                <div className="absolute top-full left-0 bg-white rounded shadow-lg z-20 min-w-44 py-1">
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    LMS cho doanh nghiệp
                  </div>
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    Giải pháp giáo dục
                  </div>
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    Tư vấn triển khai
                  </div>
                </div>
              )}
            </div>
            
            {/* Pricing */}
            <div className="cursor-pointer font-medium text-gray-800 hover:text-purple-600 py-1">
              <span>Báo giá</span>
            </div>
            
            {/* About Dropdown */}
            <div 
              className="relative flex items-center gap-1 cursor-pointer font-medium text-gray-800 hover:text-purple-600 py-1"
              onMouseEnter={() => toggleDropdown('about')}
              onMouseLeave={() => toggleDropdown('about')}
            >
              <span>Về Medoo</span>
              <FaAngleDown className="text-xs" />
              
              {showDropdown.about && (
                <div className="absolute top-full left-0 bg-white rounded shadow-lg z-20 min-w-44 py-1">
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    Giới thiệu
                  </div>
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    Đội ngũ
                  </div>
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    Blog
                  </div>
                  <div className="py-2 px-4 text-sm hover:bg-gray-50 hover:text-purple-600 cursor-pointer">
                    Liên hệ
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Right Side Icons */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Cart Icon */}
          <div 
            className="hidden md:block cursor-pointer" 
            onClick={() => alert('Giỏ hàng sẽ được triển khai sớm!')}
          >
            <FaShoppingCart className="text-xl text-gray-500 hover:text-purple-600 transition-colors" />
          </div>
          
          {/* Notifications Icon */}
          <div 
            className="hidden md:block cursor-pointer" 
            onClick={() => alert('Thông báo sẽ được triển khai sớm!')}
          >
            <FaBell className="text-xl text-gray-500 hover:text-purple-600 transition-colors" />
          </div>
          
          {/* User Avatar */}
          <div 
            className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center cursor-pointer transition-colors"
            onClick={() => alert('Tính năng tài khoản sẽ được triển khai sớm!')}
          >
            <FaUser className="text-white text-sm" />
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="block md:hidden text-gray-700"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="block md:hidden bg-white border-t border-gray-200 py-2 px-4">
          <nav className="flex flex-col">
            {/* Mobile Navigation Items */}
            <div className="border-b border-gray-100 py-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Khóa Học</span>
                <FaAngleDown 
                  className={`text-xs transition-transform ${showDropdown.courses ? 'rotate-180' : ''}`}
                  onClick={() => toggleDropdown('courses')}
                />
              </div>
              {showDropdown.courses && (
                <div className="mt-2 pl-4">
                  <div className="py-2 text-sm">Blockchain cơ bản</div>
                  <div className="py-2 text-sm">DeFi</div>
                  <div className="py-2 text-sm">NFT</div>
                  <div className="py-2 text-sm">Web3 Development</div>
                </div>
              )}
            </div>
            
            <div className="border-b border-gray-100 py-3">
              <span className="font-medium">Kiếm Tiền</span>
            </div>
            
            <div className="border-b border-gray-100 py-3">
              <span className="font-medium">Airdrop</span>
            </div>
            
            <div className="border-b border-gray-100 py-3">
              <span className="font-medium">Luyện Thi</span>
            </div>
            
            <div className="border-b border-gray-100 py-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">LMS và Dịch Vụ</span>
                <FaAngleDown 
                  className={`text-xs transition-transform ${showDropdown.lms ? 'rotate-180' : ''}`}
                  onClick={() => toggleDropdown('lms')}
                />
              </div>
              {showDropdown.lms && (
                <div className="mt-2 pl-4">
                  <div className="py-2 text-sm">LMS cho doanh nghiệp</div>
                  <div className="py-2 text-sm">Giải pháp giáo dục</div>
                  <div className="py-2 text-sm">Tư vấn triển khai</div>
                </div>
              )}
            </div>
            
            <div className="border-b border-gray-100 py-3">
              <span className="font-medium">Báo giá</span>
            </div>
            
            <div className="py-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Về Medoo</span>
                <FaAngleDown 
                  className={`text-xs transition-transform ${showDropdown.about ? 'rotate-180' : ''}`}
                  onClick={() => toggleDropdown('about')}
                />
              </div>
              {showDropdown.about && (
                <div className="mt-2 pl-4">
                  <div className="py-2 text-sm">Giới thiệu</div>
                  <div className="py-2 text-sm">Đội ngũ</div>
                  <div className="py-2 text-sm">Blog</div>
                  <div className="py-2 text-sm">Liên hệ</div>
                </div>
              )}
            </div>
            
            {/* Mobile Cart and Notification */}
            <div className="flex justify-between mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2" onClick={() => alert('Giỏ hàng sẽ được triển khai sớm!')}>
                <FaShoppingCart className="text-gray-500" />
                <span>Giỏ hàng</span>
              </div>
              <div className="flex items-center gap-2" onClick={() => alert('Thông báo sẽ được triển khai sớm!')}>
                <FaBell className="text-gray-500" />
                <span>Thông báo</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;