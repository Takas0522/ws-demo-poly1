import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppStore } from '../store/appStore';

/**
 * Navigation component with routing links
 */
const Navigation: React.FC = () => {
  const { language } = useI18n();
  const location = useLocation();
  const { sidebarOpen } = useAppStore();

  const navItems = [
    { path: '/', label: language === 'ja' ? 'ホーム' : 'Home' },
    { path: '/demo', label: language === 'ja' ? 'デモ' : 'Demo' },
    { path: '/about', label: language === 'ja' ? 'このアプリについて' : 'About' },
  ];

  const navStyle: React.CSSProperties = {
    display: sidebarOpen ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  };

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '12px 20px',
    textDecoration: 'none',
    color: isActive ? '#fff' : '#333',
    backgroundColor: isActive ? '#007bff' : 'transparent',
    borderRadius: '4px',
    transition: 'all 0.2s',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <nav style={navStyle}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={linkStyle(isActive)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
