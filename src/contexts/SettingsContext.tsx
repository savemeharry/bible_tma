import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface AppSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  verseNumbers: boolean;
  paragraphView: boolean;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: AppSettings = {
  fontSize: 16,
  fontFamily: "'PT Serif', serif",
  lineHeight: 1.5,
  verseNumbers: true,
  paragraphView: false,
};

// Create context
const SettingsContext = createContext<SettingsContextType | null>(null);

// Hook to use the context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Provider props
interface SettingsProviderProps {
  children: ReactNode;
}

// Provider component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('bible_settings');
    if (savedSettings) {
      try {
        setSettings(prev => ({
          ...prev,
          ...JSON.parse(savedSettings)
        }));
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bible_settings', JSON.stringify(settings));
    
    // Apply settings to the document
    document.documentElement.style.setProperty('--font-size-base', `${settings.fontSize}px`);
    document.documentElement.style.setProperty('--line-height', `${settings.lineHeight}`);
    document.documentElement.style.setProperty('--font-family-text', settings.fontFamily);
  }, [settings]);
  
  // Update settings
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  const value = {
    settings,
    updateSettings,
    resetSettings
  };
  
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export default SettingsContext; 