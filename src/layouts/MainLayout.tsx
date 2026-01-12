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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-gray-50 border-r border-gray-200 p-5 transition-all duration-300 overflow-hidden`}
      >
        {sidebarOpen && (
          <div>
            <h2 className="mb-5 text-xl text-gray-800 font-semibold">
              {language === 'ja' ? 'フロントエンドアプリ' : 'Frontend App'}
            </h2>
            <Navigation />
          </div>
        )}
        {!sidebarOpen && (
          <div className="text-center text-2xl text-gray-600">
            ☰
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white relative">
        {/* Header */}
        <header className="px-5 py-4 bg-white border-b border-gray-200 flex items-center gap-5">
          <button
            onClick={toggleSidebar}
            className="px-3 py-2 bg-primary-600 text-white border-none rounded text-sm cursor-pointer hover:bg-primary-700 transition-colors"
          >
            ☰ {language === 'ja' ? 'メニュー' : 'Menu'}
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <div>
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
