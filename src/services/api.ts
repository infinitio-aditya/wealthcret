import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL } from '../environments/env';

/**
 * Axios HTTP Client
 * 
 * This client is mainly for backward compatibility.
 * For new API calls, prefer using RTK Query hooks from src/app/services/*.
 * 
 * Configuration:
 * - Base URL: Loaded from environment configuration
 * - Timeout: 10 seconds
 * - Authentication: Injects JWT token from AsyncStorage
 */

const api = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - logout user
            console.warn('Unauthorized - logging out');
            await AsyncStorage.removeItem('token');
            // Dispatch logout action if needed
        }
        return Promise.reject(error);
    }
);

export default api;

