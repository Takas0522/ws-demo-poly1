import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Permission, PermissionContextValue, PermissionCheckOptions } from '../types/permission';

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

interface PermissionProviderProps {
  children: React.ReactNode;
  fetchUserPermissions?: () => Promise<User | null>;
  initialUser?: User | null;
}

/**
 * Permission Provider - Manages permission state across the application
 * 
 * This component provides permission checking functionality to all child components
 * through React Context. It handles loading states and permission validation.
 * 
 * @example
 * ```tsx
 * <PermissionProvider fetchUserPermissions={fetchUserFromAPI}>
 *   <App />
 * </PermissionProvider>
 * ```
 */
export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
  fetchUserPermissions,
  initialUser = null,
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(!!fetchUserPermissions);

  const refreshPermissions = useCallback(async () => {
    if (!fetchUserPermissions) return;

    setIsLoading(true);
    try {
      const userData = await fetchUserPermissions();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserPermissions]);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  /**
   * Check if user has permission(s)
   * 
   * @param permission - Single permission string or array of permissions
   * @param options - Options for permission check
   * @returns true if user has the required permission(s)
   */
  const hasPermission = useCallback(
    (permission: Permission | Permission[], options?: PermissionCheckOptions): boolean => {
      if (!user) return false;

      const permissions = user.permissions || [];
      const permissionArray = Array.isArray(permission) ? permission : [permission];

      if (permissionArray.length === 0) return true;

      const requireAll = options?.requireAll ?? false;

      if (requireAll) {
        return permissionArray.every((perm) => permissions.includes(perm));
      } else {
        return permissionArray.some((perm) => permissions.includes(perm));
      }
    },
    [user]
  );

  /**
   * Check if user has any of the provided permissions
   */
  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return hasPermission(permissions, { requireAll: false });
    },
    [hasPermission]
  );

  /**
   * Check if user has all of the provided permissions
   */
  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      return hasPermission(permissions, { requireAll: true });
    },
    [hasPermission]
  );

  const value: PermissionContextValue = {
    user,
    permissions: user?.permissions || [],
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

/**
 * Hook to access permission context
 * 
 * @throws Error if used outside of PermissionProvider
 * 
 * @example
 * ```tsx
 * const { hasPermission, isLoading } = usePermissions();
 * 
 * if (hasPermission('admin.delete')) {
 *   // Show delete button
 * }
 * ```
 */
export const usePermissions = (): PermissionContextValue => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
