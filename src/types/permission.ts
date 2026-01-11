/**
 * Permission types for authorization system
 */

export type Permission = string;

export interface User {
  id: string;
  username: string;
  roles: string[];
  permissions: Permission[];
}

export interface PermissionCheckOptions {
  requireAll?: boolean; // If true, user must have all permissions. If false, user needs at least one.
  onUnauthorized?: () => void;
}

export interface PermissionContextValue {
  user: User | null;
  permissions: Permission[];
  isLoading: boolean;
  hasPermission: (permission: Permission | Permission[], options?: PermissionCheckOptions) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  refreshPermissions: () => Promise<void>;
}

export interface AuthorizedComponentProps {
  children: React.ReactNode;
  permissions?: Permission | Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  onUnauthorized?: () => void;
  showLoader?: boolean;
}
