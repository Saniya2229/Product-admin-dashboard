import axios from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '@/utils/constants';

/**
 * Shared Axios instance
 * Configured with base URL, default headers, request auth interceptor,
 * and centralized error handling interceptor.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Bearer Token to every outgoing request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized Error Handler
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If request was cancelled by AbortController, do not treat as a standard network error
    if (axios.isCancel(error)) {
      return Promise.reject({ isCanceled: true, message: 'Request canceled' });
    }

    // Extract normalized error message
    const status = error.response?.status;
    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // Specialized handling for typical HTTP status codes
    if (status === 401) {
      if (typeof window !== 'undefined') {
        // Clear stored token if expired/invalid
        // Avoid automatic redirect during login endpoint failure itself
        if (!error.config?.url?.includes('/auth/login')) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
      message = error.response?.data?.message || 'Invalid or expired session. Please log in again.';
    } else if (status === 404) {
      message = error.response?.data?.message || 'Requested resource was not found.';
    } else if (status >= 500) {
      message = 'Server error occurred on DummyJSON. Please try again later.';
    }

    const customError = new Error(message);
    customError.status = status;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);

export default api;
