import api from './api';
import { User, UserRole } from '../types';

export interface LoginCredentials {
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginResponse {
    user: User;
    token: string;
}

// Mock login function - replace with actual API call
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // For now, return mock data
    const mockUsers = {
        admin: { id: '1', name: 'Alex Johnson', email: 'admin@wealthcret.com', role: 'admin' as UserRole },
        service_provider: { id: '2', name: 'Sarah Johnson', email: 'sarah@wealthcret.com', role: 'service_provider' as UserRole },
        referral_partner: { id: '3', name: 'James Wilson', email: 'james@wealthcret.com', role: 'referral_partner' as UserRole },
        client: { id: '4', name: 'John Anderson', email: 'john@email.com', role: 'client' as UserRole },
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(() => resolve(null), 1000));

    return {
        user: mockUsers[credentials.role],
        token: 'mock-jwt-token-' + credentials.role,
    };

    // Actual API call would look like:
    // const response = await api.post<LoginResponse>('/auth/login', credentials);
    // return response.data;
};

export const logout = async (): Promise<void> => {
    // Actual API call would look like:
    // await api.post('/auth/logout');
};

export const refreshToken = async (): Promise<string> => {
    const response = await api.post<{ token: string }>('/auth/refresh');
    return response.data.token;
};
