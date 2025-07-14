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
    
    // Check if the response has a server-level error (result: "error")
    if (response.data && response.data.result === 'error') {
      logger.error('Server returned error:', response.data.message);
      // Create a new error with the server's message
      const serverError = new Error(response.data.message || 'Server error');
      (serverError as any).status = response.status;
      (serverError as any).response = response;
      throw serverError;
    }
    
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase() || 'GET';
    const url = error.config?.url || '';
    
    logger.api.error(method, url, error.response?.status || 'Network Error');
    
    if (error.response) {
      // Check if the error response has server-level error info
      if (error.response.data && error.response.data.result === 'error') {
        logger.error('Server error message:', error.response.data.message);
        // Use the server's error message
        const serverError = new Error(error.response.data.message || 'Server error');
        (serverError as any).status = error.response.status;
        (serverError as any).response = error.response;
        return Promise.reject(serverError);
      }
      
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

// Server's standard API response type
export interface ServerApiResponse<T> {
  result: string;
  message: string;
  data: T | null;
}

// API response type (Axios response wrapper)
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