import React, { useState } from 'react';
import { usePermissions } from '../contexts/PermissionContext';
import { useI18n } from '../i18n/I18nContext';
import { Permission } from '../types/permission';

interface PermissionDebuggerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  defaultOpen?: boolean;
}

/**
 * PermissionDebugger - Development tool for debugging permissions
 * 
 * This component displays current user permissions and allows testing
 * permission checks in real-time. Should only be used in development.
 * 
 * @example
 * ```tsx
 * // Add to your app root during development
 * {process.env.NODE_ENV === 'development' && (
 *   <PermissionDebugger position="bottom-right" />
 * )}
 * ```
 */
export const PermissionDebugger: React.FC<PermissionDebuggerProps> = ({
  position = 'bottom-right',
  defaultOpen = false,
}) => {
  const { user, permissions, hasPermission, isLoading } = usePermissions();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [testPermission, setTestPermission] = useState('');
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleTestPermission = () => {
    if (!testPermission.trim()) return;
    const result = hasPermission(testPermission.trim());
    setTestResult(result);
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '10px', right: '10px' },
    'top-left': { top: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    border: '1px solid #3c3c3c',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '400px',
    maxHeight: '600px',
    overflowY: 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
    fontFamily: 'monospace',
    fontSize: '12px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007acc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '8px',
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#3c3c3c',
    color: '#d4d4d4',
    border: '1px solid #555',
    borderRadius: '4px',
    padding: '8px',
    width: '100%',
    marginTop: '8px',
    fontSize: '12px',
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          ...buttonStyle,
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 9999,
        }}
      >
        {t.debugPermissions}
      </button>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          {t.permissionDebugger}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{ ...buttonStyle, padding: '4px 8px', margin: 0 }}
        >
          ✕
        </button>
      </div>

      {isLoading ? (
        <div>{t.loading}</div>
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#569cd6' }}>
              {t.userInfo}
            </h4>
            {user ? (
              <div>
                <div><strong>{t.id}:</strong> {user.id}</div>
                <div><strong>{t.username}:</strong> {user.username}</div>
                <div><strong>{t.roles}:</strong> {user.roles.join(', ') || t.none}</div>
              </div>
            ) : (
              <div style={{ color: '#ce9178' }}>{t.noUserLoggedIn}</div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#569cd6' }}>
              {t.currentPermissions} ({permissions.length})
            </h4>
            {permissions.length > 0 ? (
              <div style={{ maxHeight: '150px', overflowY: 'auto', backgroundColor: '#252526', padding: '8px', borderRadius: '4px' }}>
                {permissions.map((perm, index) => (
                  <div key={index} style={{ padding: '2px 0' }}>
                    • {perm}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#ce9178' }}>{t.noPermissions}</div>
            )}
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#569cd6' }}>
              {t.testPermission}
            </h4>
            <input
              type="text"
              value={testPermission}
              onChange={(e) => setTestPermission(e.target.value)}
              placeholder={t.permissionPlaceholder}
              style={inputStyle}
              onKeyPress={(e) => e.key === 'Enter' && handleTestPermission()}
            />
            <button onClick={handleTestPermission} style={buttonStyle}>
              {t.test}
            </button>
            {testResult !== null && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: testResult ? '#4ec9b0' : '#f48771',
                  color: '#1e1e1e',
                  fontWeight: 'bold',
                }}
              >
                {testResult ? t.accessGranted : t.accessDenied}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * PermissionLogger - Logs permission checks to console
 * 
 * Useful for debugging permission-related issues in development.
 * Wraps usePermissions and logs all permission checks.
 */
export const usePermissionLogger = () => {
  const permissionContext = usePermissions();
  const { hasPermission } = permissionContext;

  const loggedHasPermission = (
    permission: Permission | Permission[],
    options?: any
  ): boolean => {
    const result = hasPermission(permission, options);
    console.log('[Permission Check]', {
      permission,
      result,
      options,
      user: permissionContext.user?.username,
    });
    return result;
  };

  return {
    ...permissionContext,
    hasPermission: loggedHasPermission,
  };
};

export default PermissionDebugger;
