/**
 * Authentication Context
 * 
 * Provides global authentication state and functions:
 * - Current user information
 * - Login/logout functionality
 * - Authentication status
 * - Loading states
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomUser, LoginRequest, LoginResponse } from '../types/auth';
import { useLoginMutation, useLazyGetUserQuery } from '../services/authApi';
import { setUser, setToken, logout as logoutFromStore } from '../../store/slices/authSlice';
import { setLogoutCallback } from '../configs/axios/AxiosConfig';

interface AuthContextType {
  user: CustomUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Wraps the app and provides authentication context
 * Handles token storage, session persistence, etc.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUserState] = useState<CustomUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // RTK Query mutations and queries
  const [loginMutation] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery();

  /**
   * Check if user is authenticated on app startup
   * Retrieves token from AsyncStorage and validates it
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setIsLoggedIn(false);
        setUserState(null);
        return;
      }

      // Validate token by fetching user
      const result = await getUser().unwrap();
      if (result) {
        dispatch(setUser(result));
        dispatch(setToken(token));
        setUserState(result);
        setIsLoggedIn(true);
        setError(null);
      }
    } catch (err) {
      // Token is invalid or expired
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserState(null);
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user with email and password
   * @param credentials - Email and password
   * @returns Promise with login response
   */
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await loginMutation(credentials).unwrap();

      // Store token in AsyncStorage
      const token = response.access || response.token;
      if (token) {
        await AsyncStorage.setItem('token', token);
      }

      // Store user in context and Redux
      const userData: CustomUser = response.user || (response as any);
      if (userData) {
        setUserState(userData);
        dispatch(setUser(userData));
        if (token) {
          dispatch(setToken(token));
        }
      }

      setIsLoggedIn(true);
      return response;
    } catch (err: any) {
      const errorMessage = err?.data?.detail || err?.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   * Clears AsyncStorage and resets state
   */
  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('token');
      dispatch(logoutFromStore());
      setUserState(null);
      setIsLoggedIn(false);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check authentication on app startup
   */
  useEffect(() => {
    checkAuth();
    
    // Register logout callback with Axios interceptor
    // This allows Axios to trigger logout on 401 errors
    setLogoutCallback(() => {
      logout().catch(err => console.error('Automatic logout failed:', err));
    });
  }, []);

  const value: AuthContextType = {
    user,
    isLoggedIn,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context
 * @returns AuthContextType
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
