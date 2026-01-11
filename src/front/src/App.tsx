import React from 'react';
import { PermissionProvider } from './contexts/PermissionContext';
import { AuthorizedComponent } from './components/AuthorizedComponent';
import { PermissionDebugger } from './components/PermissionDebugger';
import { useAuthorization } from './hooks/useAuthorization';
import { User } from './types/permission';

/**
 * Demo component showing various authorization patterns
 */
const DemoContent: React.FC = () => {
  const { hasPermission, user, checkAndExecute } = useAuthorization();

  const handleDelete = checkAndExecute(
    'admin.delete',
    () => alert('Item deleted!'),
    () => alert('You do not have permission to delete')
  );

  const handleEdit = checkAndExecute(
    'editor.edit',
    () => alert('Editing item...'),
    () => alert('You do not have permission to edit')
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Authorization Demo</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Current User: {user?.username || 'Not logged in'}</h3>
        <p>Permissions: {user?.permissions.length || 0}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Button-Level Authorization Examples</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <h3>1. Simple Permission Check</h3>
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
              Delete (Admin Only)
            </button>
          </AuthorizedComponent>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>2. Multiple Permissions (Any One)</h3>
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
              Edit (Editor or Admin)
            </button>
          </AuthorizedComponent>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>3. All Permissions Required</h3>
          <AuthorizedComponent
            permissions={['admin.view', 'admin.edit']}
            requireAll
            fallback={<div style={{ color: '#888' }}>You need both view and edit permissions</div>}
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
              Admin Panel (All Permissions)
            </button>
          </AuthorizedComponent>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>4. With Fallback Content</h3>
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
                🔒 Upgrade to Premium to access this feature
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
              Premium Feature
            </button>
          </AuthorizedComponent>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>5. Conditional Rendering with Hook</h3>
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
              View Users (Hook-based)
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Permission Information</h2>
        <p>
          This demo shows different ways to implement button-level authorization.
          Use the Permission Debugger (bottom-right) to test different scenarios.
        </p>
      </div>
    </div>
  );
};

/**
 * Main App component with Permission Provider
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
      {/* Permission Debugger - only show in development */}
      <PermissionDebugger position="bottom-right" defaultOpen={false} />
    </PermissionProvider>
  );
};

export default App;
