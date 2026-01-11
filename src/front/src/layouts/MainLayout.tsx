import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { PermissionDebugger } from '../components/PermissionDebugger';
import { useAppStore } from '../store/appStore';
import { useI18n } from '../i18n/I18nContext';

/**
 * Main layout component with sidebar navigation
 */
const MainLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { language } = useI18n();

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  };

  const sidebarStyle: React.CSSProperties = {
    width: sidebarOpen ? '250px' : '60px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #dee2e6',
    padding: '20px',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    padding: '15px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const toggleButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const contentStyle: React.CSSProperties = {
    padding: '0',
  };

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ display: sidebarOpen ? 'block' : 'none' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '20px', color: '#333' }}>
            {language === 'ja' ? 'フロントエンドアプリ' : 'Frontend App'}
          </h2>
          <Navigation />
        </div>
        {!sidebarOpen && (
          <div style={{ textAlign: 'center', fontSize: '24px' }}>
            ☰
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={mainStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <button
            onClick={toggleSidebar}
            style={toggleButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#007bff';
            }}
          >
            ☰ {language === 'ja' ? 'メニュー' : 'Menu'}
          </button>
          <div style={{ flex: 1 }} />
        </header>

        {/* Page content */}
        <div style={contentStyle}>
          <Outlet />
        </div>
      </main>

      {/* Language switcher */}
      <LanguageSwitcher position="top-right" />

      {/* Permission debugger (development only) */}
      <PermissionDebugger position="bottom-right" defaultOpen={false} />
    </div>
  );
};

export default MainLayout;
