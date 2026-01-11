import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PermissionProvider } from './contexts/PermissionContext';
import { User } from './types/permission';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import AboutPage from './pages/AboutPage';

/**
 * Main App component with routing
 */
const App: React.FC = () => {
  // Mock function to fetch user permissions
  // In production, this would call your backend API
  const fetchUserPermissions = async (): Promise<User | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock user with various permissions
    return {
      id: '1',
      username: 'demo_user',
      roles: ['editor', 'user'],
      permissions: [
        'user.view',
        'user.edit',
        'editor.edit',
        'admin.view',
        // Uncomment to test different permission levels:
        // 'admin.edit',
        // 'admin.delete',
        // 'premium.feature',
      ],
    };
  };

  return (
    <BrowserRouter>
      <PermissionProvider fetchUserPermissions={fetchUserPermissions}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="demo" element={<DemoPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </PermissionProvider>
    </BrowserRouter>
  );
};

export default App;
