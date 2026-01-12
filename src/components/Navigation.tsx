import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppStore } from '../store/appStore';
import { useAuthorization } from '../hooks/useAuthorization';

/**
 * Navigation component with routing links
 */
const Navigation: React.FC = () => {
  const { language } = useI18n();
  const location = useLocation();
  const { sidebarOpen } = useAppStore();
  const { hasAccess } = useAuthorization();

  const navItems = [
    { path: '/', label: language === 'ja' ? 'ホーム' : 'Home' },
    { path: '/demo', label: language === 'ja' ? 'デモ' : 'Demo' },
    { path: '/components', label: language === 'ja' ? 'コンポーネント' : 'Components' },
    { path: '/admin/tenants', label: language === 'ja' ? 'テナント管理' : 'Tenant Management', permission: 'global.admin' },
    { path: '/admin/users', label: language === 'ja' ? 'ユーザー管理' : 'User Management', permission: 'user.manage' },
    { path: '/admin/services', label: language === 'ja' ? 'サービスカタログ' : 'Service Catalog', permission: 'global.admin' },
    { path: '/about', label: language === 'ja' ? 'このアプリについて' : 'About' },
  ];

  if (!sidebarOpen) return null;

  return (
    <nav className="flex flex-col gap-2.5 mt-5">
      {navItems.map((item) => {
        // Check permission if required
        if (item.permission && !hasAccess(item.permission)) {
          return null;
        }
        
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`px-5 py-3 rounded transition-all no-underline ${
              isActive
                ? 'bg-primary-600 text-white font-bold'
                : 'bg-transparent text-gray-800 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
