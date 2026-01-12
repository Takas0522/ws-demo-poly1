import React from 'react';
import { useI18n } from '../i18n/I18nContext';

/**
 * Home page component
 */
const HomePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.welcome}</h1>
      <p className="text-lg text-gray-700 mt-5">
        Welcome to the frontend application foundation. This application includes:
      </p>
      <ul className="text-base mt-2.5 space-y-2 text-gray-700">
        <li>✅ React 18+ with TypeScript</li>
        <li>✅ Vite build tool</li>
        <li>✅ React Router for navigation</li>
        <li>✅ Zustand for state management</li>
        <li>✅ Axios API client with interceptors</li>
        <li>✅ Authentication context</li>
        <li>✅ Permission-based authorization</li>
        <li>✅ Internationalization (Japanese/English)</li>
        <li>✅ Tailwind CSS design system</li>
      </ul>
    </div>
  );
};

export default HomePage;
