// Main exports for the authorization system

// Context and Provider
export { PermissionProvider, usePermissions } from './contexts/PermissionContext';

// Components
export { AuthorizedComponent } from './components/AuthorizedComponent';
export { PermissionDebugger, usePermissionLogger } from './components/PermissionDebugger';

// Hooks
export { useAuthorization } from './hooks/useAuthorization';

// Types
export type {
  Permission,
  User,
  PermissionCheckOptions,
  PermissionContextValue,
  AuthorizedComponentProps,
} from './types/permission';

// Utils
export {
  matchPermission,
  hasPermissionWithWildcard,
  normalizePermissions,
  groupPermissionsByPrefix,
  extractPermissionsFromRoles,
  createPermissionChecker,
  formatPermission,
} from './utils/permissionUtils';
