import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, Translations, translations } from './translations';

interface I18nContextValue {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

/**
 * Get saved language from localStorage safely
 */
const getSavedLanguage = (defaultLanguage: Language): Language => {
  try {
    const saved = localStorage.getItem('language');
    if (saved === 'ja' || saved === 'en') {
      return saved as Language;
    }
  } catch (error) {
    // localStorage might be unavailable (privacy mode, SSR, etc.)
    console.warn('Failed to read language from localStorage:', error);
  }
  return defaultLanguage;
};

/**
 * Save language to localStorage safely
 */
const saveLanguage = (lang: Language): void => {
  try {
    localStorage.setItem('language', lang);
  } catch (error) {
    // localStorage might be unavailable
    console.warn('Failed to save language to localStorage:', error);
  }
};

/**
 * I18n Provider - Manages language and translations
 * 
 * Provides internationalization support for the application.
 * Defaults to Japanese (ja) as the primary language.
 * Automatically restores user's previous language choice from localStorage.
 * 
 * @example
 * ```tsx
 * <I18nProvider defaultLanguage="ja">
 *   <App />
 * </I18nProvider>
 * ```
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLanguage = 'ja', // Default to Japanese for Japanese speakers
}) => {
  const [language, setLanguageState] = useState<Language>(() => 
    getSavedLanguage(defaultLanguage)
  );

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  const value: I18nContextValue = {
    language,
    t: translations[language],
    setLanguage,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/**
 * Hook to access i18n context
 * 
 * @throws Error if used outside of I18nProvider
 * 
 * @example
 * ```tsx
 * const { t, language, setLanguage } = useI18n();
 * 
 * return <h1>{t.authorizationDemo}</h1>;
 * ```
 */
export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
