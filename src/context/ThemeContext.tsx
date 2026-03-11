import React, { createContext, useState, useContext, ReactNode } from "react";
import { Theme as AppTheme } from "../types";
import { getThemeById } from "../theme/themes";

interface ThemeContextProps {
  theme: AppTheme;
  setTheme: (themeConfig: any) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const deepMerge = (target: any, source: any): any => {
  if (!source) return target;
  const result = { ...target };
  Object.keys(source).forEach((key) => {
    if (
      typeof target[key] === "object" &&
      target[key] !== null &&
      typeof source[key] === "object" &&
      source[key] !== null
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
};

export const CustomThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Default to royal-gold as seen in themeSlice.ts
  const defaultTheme = getThemeById("royal-gold");
  const [theme, setThemeState] = useState<AppTheme>(defaultTheme);

  const setTheme = (backendTheme: any) => {
    if (!backendTheme) return;

    // If backendTheme is just a string (ID), load that theme
    if (typeof backendTheme === "string") {
      const newTheme = getThemeById(backendTheme);
      if (newTheme) {
        setThemeState(newTheme);
      }
      return;
    }

    // If it's a theme object, merge it with the default or current theme
    const mergedTheme = deepMerge(defaultTheme, backendTheme);
    setThemeState(mergedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within CustomThemeProvider");
  }
  return context;
};
