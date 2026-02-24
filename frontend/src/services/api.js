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
  register: (data) => api.post('/auth/register', data)
};

export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getByTeacher: (teacherId) => api.get(`/courses/teacher/${teacherId}`),
  create: (data) => api.post('/courses', data),
  delete: (id) => api.delete(`/courses/${id}`)
};

export const enrollmentAPI = {
  enroll: (data) => api.post('/enrollments', data),
  drop: (studentId, courseId) => api.delete(`/enrollments?studentId=${studentId}&courseId=${courseId}`),
  getByStudent: (studentId) => api.get(`/enrollments/student/${studentId}`),
  getBySection: (sectionId) => api.get(`/enrollments/section/${sectionId}`)
};

export const timetableAPI = {
  getByStudent: (studentId) => api.get(`/timetable/student/${studentId}`)
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  toggleUser: (userId) => api.put(`/admin/users/${userId}/toggle`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAnalytics: () => api.get('/admin/analytics')
};

export default api;
