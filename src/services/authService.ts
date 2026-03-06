import api from './api';
import { User, UserRole } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginResponse {
    user: User;
    token: string;
}

/**
 * Login function - replaced with RTK Query mutation
 * 
 * Use the RTK Query hook instead:
 * import { useLoginMutation } from '../app/services/authApi';
 * const [login] = useLoginMutation();
 * const response = await login({ email, password }).unwrap();
 * 
 * @deprecated Use useLoginMutation hook from authApi instead
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        // Use the axios instance to call the API
        const response = await api.post<any>('/api/accounts/token/obtain/', {
            email: credentials.email,
            password: credentials.password,
        });

        const data = response.data;
        const token = data.access || data.token;

        // Store token
        if (token) {
            await AsyncStorage.setItem('token', token);
        }

        return {
            user: {
                id: data.user?.id || '1',
                name: data.user?.first_name || 'User',
                email: data.user?.email || credentials.email,
                role: credentials.role,
                avatar: data.user?.avatar,
                organization: data.user?.organization,
            },
            token,
        };
    } catch (error: any) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Logout function
 * @deprecated Use useAuth hook's logout function instead
 */
export const logout = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('token');
        // Optional: Call backend logout endpoint if it exists
    } catch (error) {
        console.error('Logout error:', error);
    }
};

/**
 * Refresh token function
 * @deprecated Use RTK Query mutation for token refresh
 */
export const refreshToken = async (): Promise<string> => {
    try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<{ access: string }>('/api/accounts/token/refresh/', {
            refresh: refreshToken,
        });

        const newToken = response.data.access;
        await AsyncStorage.setItem('token', newToken);
        return newToken;
    } catch (error: any) {
        console.error('Token refresh error:', error);
        await logout();
        throw error;
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
};

/**
 * Get stored token
 */
export const getToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem('token');
};

