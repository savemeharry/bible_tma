import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useSDK } from '../utils/tma-mock';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const sdk = useSDK();

  // Initialize theme based on Telegram theme or saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    
    // If we have SDK and Telegram theme
    if (sdk?.colorScheme) {
      const telegramTheme = sdk.colorScheme.toLocaleLowerCase() as ThemeType;
      setTheme(telegramTheme);
    } 
    // Fallback to saved theme
    else if (savedTheme) {
      setTheme(savedTheme);
    }
    // Or use system preference
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [sdk]);

  // Apply theme to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 