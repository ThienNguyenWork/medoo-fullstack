import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './userAuth.css';
import logo from '../assets/medoo-logo.png';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

// Thêm constant ở đầu file
const API_BASE_URL = 'http://localhost:5001/api';

const AuthPage = ({onLoginSuccess} ) => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [forgotPasswordForm, setForgotPasswordForm] = useState({ email: '' });
  const [resetPasswordForm, setResetPasswordForm] = useState({
    password: '',
    confirmPassword: '',
    token: ''
  });

  // Sửa hàm validate token trong useEffect
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Validating token:', token);
    fetch(`${API_BASE_URL}/users/me`, { // Thay bằng endpoint lấy thông tin user
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Token validation failed');
      }
      return res.json();
    })
    .then(data => {
      if (data.user) { // Kiểm tra có data.user trả về
        navigate('/dashboard'); 
      } else {
        throw new Error('Invalid user data');
      }
    })
    .catch(err => {
      console.error('Token validation error:', err);
      localStorage.removeItem('token');
    });
  }
}, [navigate]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordForm({ ...forgotPasswordForm, [name]: value });
  };

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordForm({ ...resetPasswordForm, [name]: value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      if (data.token) {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        
        // Thông báo thành công và đợi một chút trước khi chuyển trang
        setMessage({ type: 'success', text: 'Đăng nhập thành công!' });
        
        // Gọi hàm callback để cập nhật trạng thái xác thực ở component cha
        if (onLoginSuccess) {
          onLoginSuccess(data.token);
        }
        
        // Đợi một chút trước khi chuyển trang để đảm bảo token được lưu
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Kiểm tra mật khẩu xác nhận
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu không khớp' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      if (data.token) {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        
        // Thông báo thành công
        setMessage({ type: 'success', text: 'Đăng ký thành công!' });
        
        // Gọi hàm callback để cập nhật trạng thái xác thực ở component cha
        if (onLoginSuccess) {
          onLoginSuccess(data.token);
        }
        
        // Đợi một chút trước khi chuyển trang để đảm bảo token được lưu
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Register error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Đăng ký thất bại. Vui lòng thử lại.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Note: You'll need to implement this API endpoint in your backend
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: forgotPasswordForm.email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn' 
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Không thể gửi email đặt lại mật khẩu' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validate passwords match
    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu không khớp' });
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (resetPasswordForm.password.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      setIsLoading(false);
      return;
    }

    try {
      // Note: You'll need to implement this API endpoint in your backend
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: resetPasswordForm.password,
          token: resetPasswordForm.token
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Mật khẩu đã được đặt lại thành công!' });
        
        // Redirect to login after a brief delay
        setTimeout(() => {
          setActiveTab('login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Không thể đặt lại mật khẩu' });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={logo} alt="Medoo Logo" />
        </div>

        {/* Back to Home button */}
        <div className="back-to-home">
          <Link to="/">
            <FaArrowLeft /> Trở về trang chủ
          </Link>
        </div>

        {/* Auth Tabs */}
        {activeTab !== 'forgotPassword' && activeTab !== 'resetPassword' && (
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Đăng nhập
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Đăng ký
            </button>
          </div>
        )}

        {/* Status Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="auth-form-container">
            <h2>Đăng nhập vào tài khoản của bạn</h2>
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <button 
                  type="button" 
                  className="text-button"
                  onClick={() => setActiveTab('forgotPassword')}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="social-login">
              <p>Hoặc đăng nhập với</p>
              <div className="social-buttons">
                <button type="button" className="google-btn">Google</button>
                <button type="button" className="facebook-btn">Facebook</button>
              </div>
            </div>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="auth-form-container">
            <h2>Tạo tài khoản mới</h2>
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Tên người dùng</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  placeholder="Chọn tên người dùng"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Mật khẩu</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reg-password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Nhập lại mật khẩu của bạn"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="terms-privacy">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  Tôi đồng ý với <Link to="/terms">Điều khoản sử dụng</Link> và <Link to="/privacy">Chính sách bảo mật</Link>
                </label>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </form>

            <div className="social-login">
              <p>Hoặc đăng ký với</p>
              <div className="social-buttons">
                <button type="button" className="google-btn">Google</button>
                <button type="button" className="facebook-btn">Facebook</button>
              </div>
            </div>
          </div>
        )}

        {/* Forgot Password Form */}
        {activeTab === 'forgotPassword' && (
          <div className="auth-form-container">
            <h2>Quên mật khẩu</h2>
            <p className="form-description">
              Vui lòng nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn.
            </p>
            
            <form onSubmit={handleForgotPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="forgot-email">Email</label>
                <input
                  type="email"
                  id="forgot-email"
                  name="email"
                  value={forgotPasswordForm.email}
                  onChange={handleForgotPasswordChange}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Gửi liên kết đặt lại'}
              </button>

              <div className="back-to-login">
                <button 
                  type="button" 
                  className="text-button"
                  onClick={() => setActiveTab('login')}
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reset Password Form */}
        {activeTab === 'resetPassword' && (
          <div className="auth-form-container">
            <h2>Đặt lại mật khẩu</h2>
            <p className="form-description">
              Tạo mật khẩu mới cho tài khoản của bạn.
            </p>
            
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="new-password">Mật khẩu mới</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    name="password"
                    value={resetPasswordForm.password}
                    onChange={handleResetPasswordChange}
                    placeholder="Tạo mật khẩu mới (tối thiểu 6 ký tự)"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-new-password">Xác nhận mật khẩu</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-new-password"
                    name="confirmPassword"
                    value={resetPasswordForm.confirmPassword}
                    onChange={handleResetPasswordChange}
                    placeholder="Nhập lại mật khẩu mới của bạn"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;