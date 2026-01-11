import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Language } from '../i18n/translations';

interface LanguageSwitcherProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * LanguageSwitcher - Component for switching between languages
 * 
 * Allows users to toggle between English and Japanese.
 * 
 * @example
 * ```tsx
 * <LanguageSwitcher position="top-right" />
 * ```
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  position = 'top-right',
}) => {
  const { language, setLanguage } = useI18n();

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '10px', right: '10px' },
    'top-left': { top: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    zIndex: 10000,
    display: 'flex',
    gap: '8px',
    backgroundColor: 'white',
    padding: '8px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  };

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? 'bold' : 'normal',
    backgroundColor: isActive ? '#007acc' : '#f0f0f0',
    color: isActive ? 'white' : '#333',
    transition: 'all 0.2s',
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => handleLanguageChange('ja')}
        style={buttonStyle(language === 'ja')}
        title="日本語"
      >
        🇯🇵 日本語
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        style={buttonStyle(language === 'en')}
        title="English"
      >
        🇬🇧 English
      </button>
    </div>
  );
};
