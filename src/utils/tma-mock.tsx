import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

// Type definition for Telegram WebApp global object
declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

interface SDKContextValue {
  isDarkMode?: boolean;
  colorScheme?: string;
  themeParams?: Record<string, string>;
  tg?: any; // Reference to the WebApp object
}

// Create context
const SDKContext = createContext<SDKContextValue | null>(null);

// Provider props
interface SDKProviderProps {
  options?: {
    acceptCustomStyles?: boolean;
    cssVars?: boolean;
    debug?: boolean;
  };
  children: ReactNode;
}

// Provider component
export const SDKProvider: React.FC<SDKProviderProps> = ({ options, children }) => {
  const [sdkValues, setSdkValues] = useState<SDKContextValue>({
    isDarkMode: false,
    colorScheme: 'light',
    themeParams: {},
  });

  useEffect(() => {
    const initTelegramWebApp = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Explicitly inform the WebApp that it is ready to be displayed
        tg.ready();
        
        const isDark = tg.colorScheme === 'dark';
        
        setSdkValues({
          isDarkMode: isDark,
          colorScheme: tg.colorScheme,
          themeParams: tg.themeParams || {},
          tg: tg,
        });
      } else {
        // Fallback for browsers when not in Telegram
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        setSdkValues({
          isDarkMode: prefersDarkMode,
          colorScheme: prefersDarkMode ? 'dark' : 'light',
          themeParams: {
            bg_color: prefersDarkMode ? '#1A1D24' : '#F7F9FC',
            text_color: prefersDarkMode ? '#E0E6ED' : '#2C3E50',
            hint_color: prefersDarkMode ? '#90A4AE' : '#7F8C8D',
            link_color: prefersDarkMode ? '#5DADE2' : '#2980B9',
            button_color: prefersDarkMode ? '#38A1DB' : '#3498DB',
            button_text_color: prefersDarkMode ? '#FFFFFF' : '#FFFFFF',
          },
        });
      }
    };

    // Initialize Telegram Web App or fallback
    initTelegramWebApp();
  }, []);
  
  return <SDKContext.Provider value={sdkValues}>{children}</SDKContext.Provider>;
};

// Hook to use SDK
export const useSDK = (): SDKContextValue => {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDK must be used within an SDKProvider');
  }
  return context;
};

// Display gate component (just passes children through)
interface DisplayGateProps {
  children: ReactNode;
}

export const DisplayGate: React.FC<DisplayGateProps> = ({ children }) => {
  return <>{children}</>;
};

const TMAExports = { SDKProvider, useSDK, DisplayGate };
export default TMAExports; 