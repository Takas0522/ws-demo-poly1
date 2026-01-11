import { usePermissions } from '../contexts/PermissionContext';
import { Permission, PermissionCheckOptions } from '../types/permission';

/**
 * Custom hook for permission-based operations
 * 
 * This hook provides a convenient way to check permissions and conditionally
 * execute functions based on authorization status.
 * 
 * @example
 * ```tsx
 * const { checkAndExecute, hasAccess } = useAuthorization();
 * 
 * // Check if user has access
 * const canDelete = hasAccess('admin.delete');
 * 
 * // Execute function only if authorized
 * const handleDelete = checkAndExecute(
 *   'admin.delete',
 *   () => deleteItem(itemId),
 *   () => alert('Unauthorized')
 * );
 * ```
 */
export const useAuthorization = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, user, isLoading } = usePermissions();

  /**
   * Check if user has access to a permission or set of permissions
   */
  const hasAccess = (
    permission: Permission | Permission[],
    options?: PermissionCheckOptions
  ): boolean => {
    return hasPermission(permission, options);
  };

  /**
   * Execute a function only if user has required permission(s)
   * 
   * @param permission - Required permission(s)
   * @param onAuthorized - Function to execute if authorized
   * @param onUnauthorized - Optional function to execute if unauthorized
   * @param options - Permission check options
   */
  const checkAndExecute = <T,>(
    permission: Permission | Permission[],
    onAuthorized: () => T,
    onUnauthorized?: () => void,
    options?: PermissionCheckOptions
  ): (() => T | void) => {
    return () => {
      if (hasPermission(permission, options)) {
        return onAuthorized();
      } else {
        if (onUnauthorized) {
          onUnauthorized();
        }
        if (options?.onUnauthorized) {
          options.onUnauthorized();
        }
      }
    };
  };

  /**
   * Get a filtered list of items based on permissions
   * 
   * @param items - Array of items with permission property
   * @param getPermission - Function to extract permission from item
   */
  const filterByPermission = <T,>(
    items: T[],
    getPermission: (item: T) => Permission | Permission[] | undefined
  ): T[] => {
    return items.filter((item) => {
      const permission = getPermission(item);
      if (!permission) return true;
      return hasPermission(permission);
    });
  };

  return {
    hasAccess,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkAndExecute,
    filterByPermission,
    user,
    isLoading,
  };
};

export default useAuthorization;
