import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

// Type definition for Telegram WebApp global object
declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

// Добавляем типы для пользователя Telegram
export interface TelegramUser {
  id?: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

interface SDKContextValue {
  isDarkMode?: boolean;
  colorScheme?: string;
  themeParams?: Record<string, string>;
  tg?: any; // Reference to the WebApp object
  user?: TelegramUser; // Добавляем пользователя
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
        
        // Открыть приложение в режиме полного экрана
        tg.expand();
        
        // Отключить закрытие по свайпу вниз
        tg.enableClosingConfirmation();
        
        // Можно также установить цвет фона для лучшей интеграции с Telegram
        // Это поможет избежать случайного закрытия
        const isDark = tg.colorScheme === 'dark';
        if (isDark) {
          tg.setBackgroundColor('#121212');
        } else {
          tg.setBackgroundColor('#F8F8F8');
        }
        
        // Получение данных пользователя из Telegram WebApp
        const user = tg.initDataUnsafe?.user || null;
        
        setSdkValues({
          isDarkMode: isDark,
          colorScheme: tg.colorScheme,
          themeParams: tg.themeParams || {},
          tg: tg,
          user: user,
        });
      } else {
        // Fallback for browsers when not in Telegram - мок пользователя
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Создаем тестового пользователя, когда не в Telegram
        const mockUser: TelegramUser = {
          id: 123456789,
          first_name: "Пользователь",
          last_name: "Telegram",
          username: "telegram_user",
          language_code: "ru",
          photo_url: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
          is_premium: true
        };
        
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
          user: mockUser,
          tg: {
            // Создаем базовые методы для мок-объекта WebApp
            showPopup: (params: any) => alert(params.message || "Уведомление"),
            showAlert: (message: string) => alert(message),
            showConfirm: (message: string) => window.confirm(message),
            ready: () => console.log("TMA ready"),
            close: () => console.log("TMA closed"),
            expand: () => console.log("TMA expanded to fullscreen"),
            enableClosingConfirmation: () => console.log("TMA closing confirmation enabled"),
            setBackgroundColor: (color: string) => {
              console.log(`TMA background color set to ${color}`);
              document.body.style.backgroundColor = color;
            },
            initDataUnsafe: { user: mockUser }
          }
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