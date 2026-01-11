// Main exports for the authorization system

// Context and Provider
export { PermissionProvider, usePermissions } from './contexts/PermissionContext';

// I18n
export { I18nProvider, useI18n } from './i18n/I18nContext';
export { translations } from './i18n/translations';
export type { Language, Translations } from './i18n/translations';

// Components
export { AuthorizedComponent } from './components/AuthorizedComponent';
export { PermissionDebugger, usePermissionLogger } from './components/PermissionDebugger';
export { LanguageSwitcher } from './components/LanguageSwitcher';

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
