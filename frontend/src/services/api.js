import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  updateProfile: (userId, data) => api.put(`/auth/profile/${userId}`, data)
};

export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getByTeacher: (teacherId) => api.get(`/courses/teacher/${teacherId}`),
  create: (data) => api.post('/courses', data),
  delete: (id) => api.delete(`/courses/${id}`),
  assign: (id, teacherId) => api.put(`/courses/${id}/assign`, { teacherId }),
  approve: (id) => api.put(`/courses/${id}/approve`)
};

export const enrollmentAPI = {
  enroll: (data) => api.post('/enrollments', data),
  drop: (studentId, courseId) => api.delete(`/enrollments?studentId=${studentId}&courseId=${courseId}`),
  getByStudent: (studentId) => api.get(`/enrollments/student/${studentId}`),
  getBySection: (sectionId) => api.get(`/enrollments/section/${sectionId}`),
  getAll: () => api.get('/enrollments/all')
};

export const timetableAPI = {
  getByStudent: (studentId) => api.get(`/timetable/student/${studentId}`),
  getByTeacher: (teacherId) => api.get(`/timetable/teacher/${teacherId}`)
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  toggleUser: (userId) => api.put(`/admin/users/${userId}/toggle`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAnalytics: () => api.get('/admin/analytics')
};

export default api;
