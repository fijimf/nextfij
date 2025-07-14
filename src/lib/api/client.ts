import axios from 'axios';
import Cookies from 'js-cookie';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    logger.api.request(config.method?.toUpperCase() || 'GET', config.url || '');
    const token = Cookies.get('token');
    logger.debug('Token from cookies:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      logger.debug('Authorization header set');
    }
    return config;
  },
  (error) => {
    logger.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    logger.api.response(
      response.config.method?.toUpperCase() || 'GET',
      response.config.url || '',
      response.status
    );
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase() || 'GET';
    const url = error.config?.url || '';
    
    logger.api.error(method, url, error.response?.status || 'Network Error');
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          logger.warn('Unauthorized - Clearing token and redirecting');
          Cookies.remove('token');
          window.location.href = '/login';
          break;
        case 403:
          logger.error('Forbidden access');
          break;
        case 404:
          logger.error('Resource not found');
          break;
        case 500:
          logger.error('Server error');
          break;
        default:
          logger.error('API error:', error.response.status);
      }
    } else if (error.request) {
      logger.error('No response received:', error.request);
    } else {
      logger.error('Error setting up request:', error.message);
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