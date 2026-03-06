import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL, API_TIMEOUT, ENABLE_LOGGING, ENV } from '../../../environments/env';

/**
 * Axios Instance Configuration
 * 
 * This instance is used for all API calls.
 * Features:
 * - Automatically injects JWT token from AsyncStorage
 * - Handles 401 unauthorized errors
 * - Logs requests/responses in non-production
 * - Transforms errors for consistent handling
 */

const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let logoutCallback: (() => void) | null = null;

/**
 * Set logout callback to be called on 401 errors
 * This is set by AuthContext to handle unauthorized access
 */
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

/**
 * Request Interceptor
 * - Retrieves JWT token from AsyncStorage
 * - Injects token into Authorization header
 * - Logs request details in development
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    // Inject JWT token
    const jwtKey = 'token';
    const token = await AsyncStorage.getItem(jwtKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (ENABLE_LOGGING) {
      console.log(`[${ENV.toUpperCase()}] API Request:`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (ENABLE_LOGGING) {
      console.error('Request Interceptor Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Logs successful responses (in development)
 * - Handles error responses
 * - Triggers logout on 401 (unauthorized)
 * - Transforms errors for consistent handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful API responses
    if (ENABLE_LOGGING) {
      console.log(`[${ENV.toUpperCase()}] API Response:`, {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Token expired or invalid - trigger logout
      if (ENABLE_LOGGING) {
        console.warn('[AUTH] Unauthorized access - clearing token and logging out');
      }
      
      await AsyncStorage.removeItem('token');
      if (logoutCallback) {
        logoutCallback();
      }
    } else if (error.response?.status === 403) {
      if (ENABLE_LOGGING) {
        console.warn('[AUTH] Access forbidden:', error.response.data);
      }
    } else if (error.response?.status === 404) {
      if (ENABLE_LOGGING) {
        console.warn('[API] Not found:', error.config.url);
      }
    } else if (error.response?.status === 500) {
      if (ENABLE_LOGGING) {
        console.error('[SERVER] Server error:', error.response.data);
      }
    }

    // Log all errors
    if (ENABLE_LOGGING) {
      console.error(`[${ENV.toUpperCase()}] API Error:`, {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Transform error for consistent handling
    const transformedError = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'An error occurred',
      detail: error.response?.data?.detail,
      code: error.response?.data?.code,
      data: error.response?.data,
    };

    return Promise.reject(transformedError);
  }
);

export default axiosInstance;
