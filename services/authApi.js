import api from './api';
import { AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY } from '@/utils/constants';

/**
 * Authentication Service
 * Manages user login, session storage, and logout.
 */
export const authApi = {
  /**
   * Log in with username and password
   * Calls POST /auth/login
   */
  async login({ username, password }) {
    const response = await api.post('/auth/login', {
      username: username.trim(),
      password: password.trim(),
      expiresInMins: 120, // 2 hours
    });

    const data = response.data;
    const token = data.token || data.accessToken;

    if (typeof window !== 'undefined' && token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
      // Also set a document cookie so server-side or edge middleware can read it if needed
      document.cookie = `${TOKEN_STORAGE_KEY}=${token}; path=/; max-age=7200; SameSite=Lax`;
    }

    return data;
  },

  /**
   * Log out the current user and clear local storage and cookies
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; max-age=0`;
    }
  },

  /**
   * Get currently stored user info (synchronous)
   */
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  },
};

export default authApi;
