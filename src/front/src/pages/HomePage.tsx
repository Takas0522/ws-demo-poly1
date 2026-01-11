import React from 'react';
import { useI18n } from '../i18n/I18nContext';

/**
 * Home page component
 */
const HomePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t.authorizationDemo}</h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        Welcome to the frontend application foundation. This application includes:
      </p>
      <ul style={{ fontSize: '16px', marginTop: '10px', lineHeight: '2' }}>
        <li>✅ React 18+ with TypeScript</li>
        <li>✅ Vite build tool</li>
        <li>✅ React Router for navigation</li>
        <li>✅ Zustand for state management</li>
        <li>✅ Axios API client with interceptors</li>
        <li>✅ Authentication context</li>
        <li>✅ Permission-based authorization</li>
        <li>✅ Internationalization (Japanese/English)</li>
      </ul>
    </div>
  );
};

export default HomePage;
