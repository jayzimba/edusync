import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/routes';

// Create axios instance
const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
            { refreshToken }
          );

          const { accessToken } = response.data;
          await AsyncStorage.setItem('authToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);
        // You can add navigation logic here to redirect to login
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post(API_ENDPOINTS.LOGIN, credentials),
  logout: () => api.post(API_ENDPOINTS.LOGOUT),
  refreshToken: (refreshToken) => api.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken }),
};

export const userAPI = {
  getProfile: () => api.get(API_ENDPOINTS.PROFILE),
  updateProfile: (data) => api.put(API_ENDPOINTS.PROFILE, data),
};

export const programsAPI = {
  getAll: () => api.get(API_ENDPOINTS.PROGRAMS),
  getEnrolled: () => api.get(API_ENDPOINTS.PROGRAMS_ENROLLED),
  getById: (id) => api.get(`${API_ENDPOINTS.PROGRAMS}/${id}`),
};

export const coursesAPI = {
  getAll: () => api.get(API_ENDPOINTS.COURSES),
  getById: (id) => api.get(API_ENDPOINTS.COURSE_DETAIL.replace(':id', id)),
  getMaterials: (id) => api.get(API_ENDPOINTS.COURSE_MATERIALS.replace(':id', id)),
};

export const materialsAPI = {
  getAll: () => api.get(API_ENDPOINTS.MATERIALS),
  download: (id) => api.get(API_ENDPOINTS.MATERIAL_DOWNLOAD.replace(':id', id)),
};

export const assignmentsAPI = {
  getAll: () => api.get(API_ENDPOINTS.ASSIGNMENTS),
  getById: (id) => api.get(`${API_ENDPOINTS.ASSIGNMENTS}/${id}`),
  submit: (id, data) => api.post(API_ENDPOINTS.ASSIGNMENT_SUBMIT.replace(':id', id), data),
};

export const examsAPI = {
  getAll: () => api.get(API_ENDPOINTS.EXAMS),
  getById: (id) => api.get(`${API_ENDPOINTS.EXAMS}/${id}`),
  start: (id) => api.post(API_ENDPOINTS.EXAM_START.replace(':id', id)),
  submit: (id, data) => api.post(API_ENDPOINTS.EXAM_SUBMIT.replace(':id', id), data),
};

export default api; 