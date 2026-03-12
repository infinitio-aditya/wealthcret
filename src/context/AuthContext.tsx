import React, { createContext, useContext, useEffect, useState } from "react";
import { CustomUser } from "../types/backend/auth";
import { useLazyGetUserQuery } from "../services/backend/authApi";
import { useThemeContext } from "./ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {
  setUser as setUserRedux,
  logout as logoutRedux,
} from "../store/slices/authSlice";

type AuthContextType = {
  user: CustomUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (userData: CustomUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [triggerGetUser] = useLazyGetUserQuery();
  const { setTheme } = useThemeContext();
  const dispatch = useDispatch();

  const login = (userData: CustomUser) => {
    setUser(userData);
    setIsLoggedIn(true);
    dispatch(setUserRedux(userData));
    if (userData.theme) {
      setTheme(userData.theme);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    dispatch(logoutRedux());
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    // Reset theme to default if needed, or keep current
  };

  useEffect(() => {
    const getUserFromBackend = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const result = await triggerGetUser().unwrap();

        setUser(result);
        setIsLoggedIn(true);
        dispatch(setUserRedux(result));

        if (result.theme) {
          setTheme(result.theme);
        }
      } catch (authError) {
        console.error("Auth restoration error:", authError);
      } finally {
        setLoading(false);
      }
    };
    getUserFromBackend();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
