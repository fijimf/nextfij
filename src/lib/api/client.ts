import axios from 'axios';
import Cookies from 'js-cookie';

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔵 API Client Request Interceptor');
    console.log('🔵 Request URL:', config.url);
    const token = Cookies.get('token');
    console.log('🔵 Token from cookies:', token ? '✅ Present' : '❌ Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔵 Authorization header set:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    console.error('🔴 Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('🟢 API Client Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🔴 API Client Error:', error.response?.status, error.config?.url);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('🔴 Unauthorized - Clearing token and redirecting');
          Cookies.remove('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('🔴 Forbidden access');
          break;
        case 404:
          console.error('🔴 Resource not found');
          break;
        case 500:
          console.error('🔴 Server error');
          break;
        default:
          console.error('🔴 API error:', error.response.status);
      }
    } else if (error.request) {
      console.error('🔴 No response received:', error.request);
    } else {
      console.error('🔴 Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// API response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// API error type
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
} 