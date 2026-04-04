import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate client for refresh requests to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';

    const shouldTryRefresh =
      status === 401 &&
      !originalRequest?._retry &&
      !requestUrl.includes('/admin/login') &&
      !requestUrl.includes('/admin/register') &&
      !requestUrl.includes('/admin/refresh-token');

    if (shouldTryRefresh) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await refreshClient.post('/admin/refresh-token');
        const newAccessToken = refreshResponse.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        const refreshMessage =
          refreshError.response?.data?.message ||
          refreshError.message ||
          'Session expired. Please login again.';
        console.error('API Error:', refreshMessage);
        throw new Error(refreshMessage);
      }
    }

    const message = error.response?.data?.message || error.message || 'API request failed';
    console.error('API Error:', message);
    throw new Error(message);
  }
);

export const apiCall = axiosInstance;
export default API_BASE_URL;
