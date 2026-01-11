import React from 'react';
import { PermissionProvider } from './contexts/PermissionContext';
import { AuthorizedComponent } from './components/AuthorizedComponent';
import { PermissionDebugger } from './components/PermissionDebugger';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useAuthorization } from './hooks/useAuthorization';
import { useI18n } from './i18n/I18nContext';
import { User } from './types/permission';

/**
 * Demo component showing various authorization patterns
 */
const DemoContent: React.FC = () => {
  const { hasPermission, user, checkAndExecute } = useAuthorization();
  const { t } = useI18n();

  const handleDelete = checkAndExecute(
    'admin.delete',
    () => alert(t.itemDeleted),
    () => alert(t.noDeletePermission)
  );

  const handleEdit = checkAndExecute(
    'editor.edit',
    () => alert(t.editingItem),
    () => alert(t.noEditPermission)
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{t.authorizationDemo}</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>{t.currentUser}: {user?.username || t.notLoggedIn}</h3>
        <p>{t.permissions}: {user?.permissions.length || 0}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>{t.buttonLevelAuthExamples}</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <h3>{t.simplePermissionCheck}</h3>
          <AuthorizedComponent permissions="admin.delete">
            <button
              onClick={handleDelete}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {t.deleteAdminOnly}
            </button>
          </AuthorizedComponent>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>{t.multiplePermissionsAnyOne}</h3>
          <AuthorizedComponent permissions={['editor.edit', 'admin.edit']}>
            <button
              onClick={handleEdit}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {t.editEditorOrAdmin}
            </button>
          </AuthorizedComponent>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>{t.allPermissionsRequired}</h3>
          <AuthorizedComponent
            permissions={['admin.view', 'admin.edit']}
            requireAll
            fallback={<div style={{ color: '#888' }}>{t.needBothViewAndEdit}</div>}
          >
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {t.adminPanelAllPermissions}
            </button>
          </AuthorizedComponent>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>{t.withFallbackContent}</h3>
          <AuthorizedComponent
            permissions="premium.feature"
            fallback={
              <div
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffc107',
                  borderRadius: '4px',
                }}
              >
                {t.upgradeToPremium}
              </div>
            }
          >
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {t.premiumFeature}
            </button>
          </AuthorizedComponent>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>{t.conditionalRenderingWithHook}</h3>
          {hasPermission('user.view') && (
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {t.viewUsersHookBased}
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>{t.permissionInformation}</h2>
        <p>
          {t.permissionInfoText}
        </p>
      </div>
    </div>
  );
};

/**
 * Main App component with Permission Provider and I18n Provider
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
    <PermissionProvider fetchUserPermissions={fetchUserPermissions}>
      <DemoContent />
      <LanguageSwitcher position="top-right" />
      {/* Permission Debugger - only show in development */}
      <PermissionDebugger position="bottom-right" defaultOpen={false} />
    </PermissionProvider>
  );
};

export default App;
