import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';
import { AuthorizedComponentProps } from '../types/permission';

/**
 * Default loading component shown during permission checks
 */
const DefaultLoader: React.FC = () => (
  <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
    Loading...
  </div>
);

/**
 * AuthorizedComponent - Wrapper component for permission-based rendering
 * 
 * This component conditionally renders its children based on user permissions.
 * It provides loading states, fallback content, and unauthorized callbacks.
 * 
 * @example
 * ```tsx
 * // Simple usage - show button only if user has delete permission
 * <AuthorizedComponent permissions="admin.delete">
 *   <button>Delete</button>
 * </AuthorizedComponent>
 * 
 * // Require multiple permissions (any one)
 * <AuthorizedComponent permissions={["admin.edit", "editor.edit"]}>
 *   <button>Edit</button>
 * </AuthorizedComponent>
 * 
 * // Require all permissions
 * <AuthorizedComponent permissions={["admin.view", "admin.edit"]} requireAll>
 *   <button>Admin Panel</button>
 * </AuthorizedComponent>
 * 
 * // With fallback content
 * <AuthorizedComponent 
 *   permissions="premium.feature"
 *   fallback={<div>Upgrade to access this feature</div>}
 * >
 *   <PremiumFeature />
 * </AuthorizedComponent>
 * 
 * // With unauthorized callback
 * <AuthorizedComponent 
 *   permissions="admin.delete"
 *   onUnauthorized={() => console.log('User tried to access unauthorized feature')}
 * >
 *   <button>Delete</button>
 * </AuthorizedComponent>
 * ```
 */
export const AuthorizedComponent: React.FC<AuthorizedComponentProps> = ({
  children,
  permissions,
  requireAll = false,
  fallback = null,
  onUnauthorized,
  showLoader = true,
}) => {
  const { hasPermission, isLoading } = usePermissions();

  // Show loader during permission check if enabled
  if (isLoading && showLoader) {
    return <DefaultLoader />;
  }

  // If no permissions specified, always render children
  if (!permissions) {
    return <>{children}</>;
  }

  // Check permissions
  const hasAccess = hasPermission(permissions, { requireAll, onUnauthorized });

  // If user doesn't have permission, trigger callback and show fallback
  if (!hasAccess) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return <>{fallback}</>;
  }

  // User has permission, render children
  return <>{children}</>;
};

export default AuthorizedComponent;
