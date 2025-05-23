// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api'; // Thay đổi tuỳ server thực tế

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  connectWallet: (walletAddress) => api.post('/users/connect-wallet', { walletAddress })
};

export const courseService = {
  getAllCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  updateProgress: (courseId, lessonId, watchedSeconds, totalDuration) => 
    api.post("/progress", { 
      courseId, 
      lessonId, 
      watchedSeconds,
      totalDuration // Thêm trường này
    }),
  getProgress: (courseId) => api.get(`/progress/${courseId}`),
  getDashboardStats: () => api.get('/progress/stats/dashboard')
};

export const contactService = {
  submitContact: (data) => api.post('/contacts', data),
};

export default api;
