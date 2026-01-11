import { Permission } from '../types/permission';

/**
 * Utility functions for permission management
 */

/**
 * Check if a permission matches a pattern (supports wildcards)
 * 
 * @example
 * matchPermission('admin.*', 'admin.delete') // true
 * matchPermission('admin.delete', 'admin.delete') // true
 * matchPermission('admin.*', 'user.view') // false
 * matchPermission('admin.*', 'admin.users.delete') // true
 */
export const matchPermission = (pattern: string, permission: string): boolean => {
  if (pattern === permission) return true;
  if (pattern === '*') return true;

  const patternParts = pattern.split('.');
  const permissionParts = permission.split('.');

  // Check if pattern ends with wildcard
  if (patternParts[patternParts.length - 1] === '*') {
    const prefixParts = patternParts.slice(0, -1);
    
    // Permission must have at least as many parts as the prefix
    if (permissionParts.length < prefixParts.length) {
      return false;
    }
    
    // Check if all prefix parts match
    return prefixParts.every((part, i) => part === permissionParts[i] || part === '*');
  }

  // If no wildcard at the end, lengths must match exactly
  if (patternParts.length !== permissionParts.length) {
    return false;
  }

  return patternParts.every((part, i) => part === permissionParts[i] || part === '*');
};

/**
 * Check if user has permission with wildcard support
 */
export const hasPermissionWithWildcard = (
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean => {
  return userPermissions.some((userPerm) => matchPermission(userPerm, requiredPermission));
};

/**
 * Normalize permissions array (remove duplicates, sort)
 */
export const normalizePermissions = (permissions: Permission[]): Permission[] => {
  return Array.from(new Set(permissions)).sort();
};

/**
 * Group permissions by prefix (e.g., 'admin.delete' -> 'admin')
 */
export const groupPermissionsByPrefix = (
  permissions: Permission[]
): Record<string, Permission[]> => {
  const groups: Record<string, Permission[]> = {};

  permissions.forEach((perm) => {
    const prefix = perm.split('.')[0] || 'root';
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(perm);
  });

  return groups;
};

/**
 * Extract permissions from roles (if roles contain permission information)
 */
export const extractPermissionsFromRoles = (
  roles: string[],
  rolePermissionMap: Record<string, Permission[]>
): Permission[] => {
  const permissions: Permission[] = [];

  roles.forEach((role) => {
    const rolePerms = rolePermissionMap[role] || [];
    permissions.push(...rolePerms);
  });

  return normalizePermissions(permissions);
};

/**
 * Create a permission checker function
 */
export const createPermissionChecker = (userPermissions: Permission[]) => {
  return (requiredPermission: Permission | Permission[], requireAll = false): boolean => {
    const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

    if (requireAll) {
      return required.every((perm) => hasPermissionWithWildcard(userPermissions, perm));
    } else {
      return required.some((perm) => hasPermissionWithWildcard(userPermissions, perm));
    }
  };
};

/**
 * Format permission for display (e.g., 'admin.delete' -> 'Admin Delete')
 */
export const formatPermission = (permission: Permission): string => {
  return permission
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};
