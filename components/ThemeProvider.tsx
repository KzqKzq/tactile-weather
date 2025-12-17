import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  [key: string]: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  customTheme?: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
  customTheme?: ThemeConfig;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'light',
  customTheme 
}) => {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    // Also apply to body to support styles that (incorrectly) attach theme vars to body.
    document.body?.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (customTheme) {
      Object.entries(customTheme).forEach(([key, value]) => {
        // Ensure keys start with --twx- if strictly enforcing, but flexibility is better
        root.style.setProperty(key, value as string);
      });
    }
    
    return () => {
      if (customTheme) {
        Object.keys(customTheme).forEach(key => {
          root.style.removeProperty(key);
        });
      }
    };
  }, [customTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, customTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
