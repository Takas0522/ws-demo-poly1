/**
 * Internationalization types and translations
 */

export type Language = 'en' | 'ja';

export interface Translations {
  // App.tsx
  authorizationDemo: string;
  currentUser: string;
  notLoggedIn: string;
  permissions: string;
  buttonLevelAuthExamples: string;
  simplePermissionCheck: string;
  deleteAdminOnly: string;
  multiplePermissionsAnyOne: string;
  editEditorOrAdmin: string;
  allPermissionsRequired: string;
  needBothViewAndEdit: string;
  adminPanelAllPermissions: string;
  withFallbackContent: string;
  upgradeToPremium: string;
  premiumFeature: string;
  conditionalRenderingWithHook: string;
  viewUsersHookBased: string;
  permissionInformation: string;
  permissionInfoText: string;
  
  // Home page
  welcome: string;
  
  // Alerts
  itemDeleted: string;
  noDeletePermission: string;
  editingItem: string;
  noEditPermission: string;
  
  // AuthorizedComponent
  loading: string;
  
  // PermissionDebugger
  debugPermissions: string;
  permissionDebugger: string;
  userInfo: string;
  id: string;
  username: string;
  roles: string;
  none: string;
  noUserLoggedIn: string;
  currentPermissions: string;
  noPermissions: string;
  testPermission: string;
  test: string;
  accessGranted: string;
  accessDenied: string;
  permissionPlaceholder: string;
  
  // Tenant Management
  tenantManagement: string;
  tenantName: string;
  tenantDetails: string;
  createTenant: string;
  searchTenants: string;
  filterByStatus: string;
  filterByPlan: string;
  allStatuses: string;
  allPlans: string;
  status: string;
  active: string;
  inactive: string;
  suspended: string;
  plan: string;
  free: string;
  basic: string;
  premium: string;
  enterprise: string;
  createdAt: string;
  noTenantsFound: string;
  previous: string;
  next: string;
  pageXofY: string;
  back: string;
  delete: string;
  save: string;
  saving: string;
  cancel: string;
  create: string;
  creating: string;
  confirm: string;
  add: string;
  remove: string;
  assign: string;
  basicInformation: string;
  subscriptionManagement: string;
  subscription: string;
  startDate: string;
  endDate: string;
  optional: string;
  allowedDomains: string;
  enterDomain: string;
  noDomains: string;
  tenantAdmins: string;
  assignAdmin: string;
  noAdmins: string;
  searchUsers: string;
  confirmDelete: string;
  confirmDeleteMessage: string;
  tenantNameRequired: string;
  startDateRequired: string;
  endDateMustBeAfterStart: string;
  invalidDomainFormat: string;
  enterTenantName: string;
  confirmCreateTenant: string;
  confirmCreateMessage: string;
  tenantUpdatedSuccessfully: string;
  adminAssignedSuccessfully: string;
  adminRemovedSuccessfully: string;
  failedToUpdateTenant: string;
  failedToAssignAdmin: string;
  failedToRemoveAdmin: string;
  failedToDeleteTenant: string;
  failedToCreateTenant: string;
  
  // User Management
  userManagement: string;
  createUser: string;
  userDetails: string;
  email: string;
  password: string;
  userType: string;
  internal: string;
  external: string;
  allUserTypes: string;
  tenants: string;
  noTenants: string;
  noUsersFound: string;
  enterUsername: string;
  enterEmail: string;
  enterPassword: string;
  passwordHelp: string;
  usernameRequired: string;
  emailRequired: string;
  passwordRequired: string;
  passwordTooShort: string;
  invalidEmail: string;
  validatingEmail: string;
  emailDomainInternal: string;
  emailDomainExternal: string;
  primaryTenant: string;
  selectTenant: string;
  createUserFailed: string;
  updateUserFailed: string;
  deleteUserFailed: string;
  userNotFound: string;
  userUpdated: string;
  deleteUser: string;
  confirmDeleteUser: string;
  updatedAt: string;
  tenantAssignments: string;
  noTenantAssignments: string;
  manageTenants: string;
  addTenant: string;
  selectRoles: string;
  pleaseSelectTenantAndRoles: string;
  assignTenantFailed: string;
  removeTenantFailed: string;
  confirmRemoveTenant: string;
  adding: string;
  edit: string;
  primary: string;
  secondary: string;
  tenantInformation: string;
  removeTenant: string;
  saveChanges: string;
  pleaseSelectAtLeastOneRole: string;
  rolesUpdated: string;
  updateRolesFailed: string;
  selected: string;
  selectAction: string;
  setActive: string;
  setInactive: string;
  setSuspended: string;
  deleteSelected: string;
  apply: string;
  selectAll: string;
  bulkOperationFailed: string;
  
  // Service Management
  serviceCatalog: string;
  serviceManagement: string;
  services: string;
  serviceDetails: string;
  category: string;
  allCategories: string;
  storage: string;
  communication: string;
  analytics: string;
  security: string;
  integration: string;
  available: string;
  beta: string;
  comingSoon: string;
  requiredPlan: string;
  version: string;
  features: string;
  enabledFeatures: string;
  viewDetails: string;
  closeDetails: string;
  searchServices: string;
  noServicesFound: string;
  tenantServiceAssignment: string;
  serviceAssignment: string;
  assignServices: string;
  enableService: string;
  disableService: string;
  serviceEnabled: string;
  serviceDisabled: string;
  planRestriction: string;
  upgradeRequired: string;
  featureFlags: string;
  toggleFeature: string;
  featureName: string;
  featureDescription: string;
  professionalPlan: string;
  serviceUpdatedSuccessfully: string;
  serviceUpdateFailed: string;
  selectTenantFirst: string;
  professional: string;
  orHigher: string;
  enabled: string;
  assigned: string;
  
  // Dashboard
  dashboard: string;
  systemStatistics: string;
  tenantStatistics: string;
  userStatistics: string;
  tenantsByPlan: string;
  serviceUsage: string;
  activityFeed: string;
  noRecentActivity: string;
  last7Days: string;
  last30Days: string;
  last90Days: string;
  allTime: string;
  performedBy: string;
  
  // Global Search
  globalSearch: string;
  searchPlaceholder: string;
  searchKeywords: string;
  noResultsFound: string;
  searchResults: string;
  navigateWithArrows: string;
  
  // Saved Filters
  savedFilters: string;
  selectFilter: string;
  saveCurrentFilter: string;
  manageFilters: string;
  saveFilter: string;
  filterName: string;
  filterNamePlaceholder: string;
  noSavedFilters: string;
  filterNameRequired: string;
  filterSaved: string;
  filterDeleted: string;
  deleteFilter: string;
  applyFilter: string;
  tenantFilters: string;
  userFilters: string;
  serviceFilters: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // App.tsx
    authorizationDemo: 'Authorization Demo',
    currentUser: 'Current User',
    notLoggedIn: 'Not logged in',
    permissions: 'Permissions',
    buttonLevelAuthExamples: 'Button-Level Authorization Examples',
    simplePermissionCheck: '1. Simple Permission Check',
    deleteAdminOnly: 'Delete (Admin Only)',
    multiplePermissionsAnyOne: '2. Multiple Permissions (Any One)',
    editEditorOrAdmin: 'Edit (Editor or Admin)',
    allPermissionsRequired: '3. All Permissions Required',
    needBothViewAndEdit: 'You need both view and edit permissions',
    adminPanelAllPermissions: 'Admin Panel (All Permissions)',
    withFallbackContent: '4. With Fallback Content',
    upgradeToPremium: '🔒 Upgrade to Premium to access this feature',
    premiumFeature: 'Premium Feature',
    conditionalRenderingWithHook: '5. Conditional Rendering with Hook',
    viewUsersHookBased: 'View Users (Hook-based)',
    permissionInformation: 'Permission Information',
    permissionInfoText: 'This demo shows different ways to implement button-level authorization. Use the Permission Debugger (bottom-right) to test different scenarios.',
    
    // Home page
    welcome: 'Welcome',
    
    // Alerts
    itemDeleted: 'Item deleted!',
    noDeletePermission: 'You do not have permission to delete',
    editingItem: 'Editing item...',
    noEditPermission: 'You do not have permission to edit',
    
    // AuthorizedComponent
    loading: 'Loading...',
    
    // PermissionDebugger
    debugPermissions: '🔐 Debug Permissions',
    permissionDebugger: '🔐 Permission Debugger',
    userInfo: 'User Info',
    id: 'ID',
    username: 'Username',
    roles: 'Roles',
    none: 'None',
    noUserLoggedIn: 'No user logged in',
    currentPermissions: 'Current Permissions',
    noPermissions: 'No permissions',
    testPermission: 'Test Permission',
    test: 'Test',
    accessGranted: '✓ Access Granted',
    accessDenied: '✗ Access Denied',
    permissionPlaceholder: 'e.g., admin.delete',
    
    // Tenant Management
    tenantManagement: 'Tenant Management',
    tenantName: 'Tenant Name',
    tenantDetails: 'Tenant Details',
    createTenant: 'Create Tenant',
    searchTenants: 'Search tenants...',
    filterByStatus: 'Filter by status',
    filterByPlan: 'Filter by plan',
    allStatuses: 'All Statuses',
    allPlans: 'All Plans',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    plan: 'Plan',
    free: 'Free',
    basic: 'Basic',
    premium: 'Premium',
    enterprise: 'Enterprise',
    createdAt: 'Created At',
    noTenantsFound: 'No tenants found',
    previous: 'Previous',
    next: 'Next',
    pageXofY: 'Page {{current}} of {{total}}',
    back: 'Back',
    delete: 'Delete',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    create: 'Create',
    creating: 'Creating...',
    confirm: 'Confirm',
    add: 'Add',
    remove: 'Remove',
    assign: 'Assign',
    basicInformation: 'Basic Information',
    subscriptionManagement: 'Subscription Management',
    subscription: 'Subscription',
    startDate: 'Start Date',
    endDate: 'End Date',
    optional: 'Optional',
    allowedDomains: 'Allowed Domains',
    enterDomain: 'Enter domain (e.g., example.com)',
    noDomains: 'No domains configured',
    tenantAdmins: 'Tenant Administrators',
    assignAdmin: 'Assign Admin',
    noAdmins: 'No administrators assigned',
    searchUsers: 'Search users...',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete this tenant? This action cannot be undone.',
    tenantNameRequired: 'Tenant name is required',
    startDateRequired: 'Start date is required',
    endDateMustBeAfterStart: 'End date must be after start date',
    invalidDomainFormat: 'Invalid domain format',
    enterTenantName: 'Enter tenant name',
    confirmCreateTenant: 'Confirm Tenant Creation',
    confirmCreateMessage: 'Please review the tenant information before creating:',
    tenantUpdatedSuccessfully: 'Tenant updated successfully!',
    adminAssignedSuccessfully: 'Admin assigned successfully!',
    adminRemovedSuccessfully: 'Admin removed successfully!',
    failedToUpdateTenant: 'Failed to update tenant. Please try again.',
    failedToAssignAdmin: 'Failed to assign admin. Please try again.',
    failedToRemoveAdmin: 'Failed to remove admin. Please try again.',
    failedToDeleteTenant: 'Failed to delete tenant. Please try again.',
    failedToCreateTenant: 'Failed to create tenant. Please try again.',
    
    // User Management
    userManagement: 'User Management',
    createUser: 'Create User',
    userDetails: 'User Details',
    email: 'Email',
    password: 'Password',
    userType: 'User Type',
    internal: 'Internal',
    external: 'External',
    allUserTypes: 'All User Types',
    tenants: 'Tenants',
    noTenants: 'No tenants',
    noUsersFound: 'No users found',
    enterUsername: 'Enter username',
    enterEmail: 'Enter email',
    enterPassword: 'Enter password',
    passwordHelp: 'Minimum 8 characters',
    usernameRequired: 'Username is required',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 8 characters',
    invalidEmail: 'Invalid email format',
    validatingEmail: 'Validating email...',
    emailDomainInternal: 'Email domain appears to be internal',
    emailDomainExternal: 'Email domain appears to be external',
    primaryTenant: 'Primary Tenant',
    selectTenant: 'Select tenant...',
    createUserFailed: 'Failed to create user',
    updateUserFailed: 'Failed to update user',
    deleteUserFailed: 'Failed to delete user',
    userNotFound: 'User not found',
    userUpdated: 'User updated successfully',
    deleteUser: 'Delete User',
    confirmDeleteUser: 'Are you sure you want to delete this user?',
    updatedAt: 'Updated At',
    tenantAssignments: 'Tenant Assignments',
    noTenantAssignments: 'No tenant assignments',
    manageTenants: 'Manage Tenants',
    addTenant: 'Add Tenant',
    selectRoles: 'Select Roles',
    pleaseSelectTenantAndRoles: 'Please select a tenant and at least one role',
    assignTenantFailed: 'Failed to assign tenant',
    removeTenantFailed: 'Failed to remove tenant',
    confirmRemoveTenant: 'Are you sure you want to remove this tenant assignment?',
    adding: 'Adding...',
    edit: 'Edit',
    primary: 'Primary',
    secondary: 'Secondary',
    tenantInformation: 'Tenant Information',
    removeTenant: 'Remove Tenant',
    saveChanges: 'Save Changes',
    pleaseSelectAtLeastOneRole: 'Please select at least one role',
    rolesUpdated: 'Roles updated successfully',
    updateRolesFailed: 'Failed to update roles',
    selected: 'selected',
    selectAction: 'Select action...',
    setActive: 'Set Active',
    setInactive: 'Set Inactive',
    setSuspended: 'Set Suspended',
    deleteSelected: 'Delete',
    apply: 'Apply',
    selectAll: 'Select All',
    bulkOperationFailed: 'Bulk operation failed',
    
    // Service Management
    serviceCatalog: 'Service Catalog',
    serviceManagement: 'Service Management',
    services: 'Services',
    serviceDetails: 'Service Details',
    category: 'Category',
    allCategories: 'All Categories',
    storage: 'Storage',
    communication: 'Communication',
    analytics: 'Analytics',
    security: 'Security',
    integration: 'Integration',
    available: 'Available',
    beta: 'Beta',
    comingSoon: 'Coming Soon',
    requiredPlan: 'Required Plan',
    version: 'Version',
    features: 'Features',
    enabledFeatures: 'Enabled Features',
    viewDetails: 'View Details',
    closeDetails: 'Close',
    searchServices: 'Search services...',
    noServicesFound: 'No services found',
    tenantServiceAssignment: 'Tenant Service Assignment',
    serviceAssignment: 'Service Assignment',
    assignServices: 'Assign Services',
    enableService: 'Enable Service',
    disableService: 'Disable Service',
    serviceEnabled: 'Service Enabled',
    serviceDisabled: 'Service Disabled',
    planRestriction: 'Plan Restriction',
    upgradeRequired: 'Upgrade Required',
    featureFlags: 'Feature Flags',
    toggleFeature: 'Toggle Feature',
    featureName: 'Feature Name',
    featureDescription: 'Description',
    professionalPlan: 'Professional',
    serviceUpdatedSuccessfully: 'Service updated successfully',
    serviceUpdateFailed: 'Failed to update service',
    selectTenantFirst: 'Please select a tenant first',
    professional: 'Professional',
    orHigher: ' or higher',
    enabled: 'Enabled',
    assigned: 'Assigned:',
    
    // Dashboard
    dashboard: 'Dashboard',
    systemStatistics: 'System Statistics',
    tenantStatistics: 'Tenant Statistics',
    userStatistics: 'User Statistics',
    tenantsByPlan: 'Tenants by Plan',
    serviceUsage: 'Service Usage',
    activityFeed: 'Activity Feed',
    noRecentActivity: 'No recent activity',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    last90Days: 'Last 90 days',
    allTime: 'All time',
    performedBy: 'By',
    
    // Global Search
    globalSearch: 'Global Search',
    searchPlaceholder: 'Search... (Cmd+K or Ctrl+K)',
    searchKeywords: 'Enter search keywords',
    noResultsFound: 'No results found',
    searchResults: 'results',
    navigateWithArrows: 'Navigate with arrows, Enter to select, Esc to close',
    
    // Saved Filters
    savedFilters: 'Saved Filters',
    selectFilter: 'Select filter...',
    saveCurrentFilter: 'Save Current Filter',
    manageFilters: 'Manage Filters',
    saveFilter: 'Save Filter',
    filterName: 'Filter Name',
    filterNamePlaceholder: 'e.g., Active Enterprise Tenants',
    noSavedFilters: 'No saved filters',
    filterNameRequired: 'Please enter a filter name',
    filterSaved: 'Filter saved successfully',
    filterDeleted: 'Filter deleted successfully',
    deleteFilter: 'Delete Filter',
    applyFilter: 'Apply Filter',
    tenantFilters: 'Tenant Filters',
    userFilters: 'User Filters',
    serviceFilters: 'Service Filters',
  },
  ja: {
    // App.tsx
    authorizationDemo: '認可デモ',
    currentUser: '現在のユーザー',
    notLoggedIn: 'ログインしていません',
    permissions: '権限',
    buttonLevelAuthExamples: 'ボタンレベル認可の例',
    simplePermissionCheck: '1. シンプルな権限チェック',
    deleteAdminOnly: '削除（管理者のみ）',
    multiplePermissionsAnyOne: '2. 複数権限（いずれか）',
    editEditorOrAdmin: '編集（編集者または管理者）',
    allPermissionsRequired: '3. すべての権限が必要',
    needBothViewAndEdit: '閲覧と編集の両方の権限が必要です',
    adminPanelAllPermissions: '管理パネル（すべての権限）',
    withFallbackContent: '4. フォールバックコンテンツ付き',
    upgradeToPremium: '🔒 この機能にアクセスするにはプレミアムにアップグレードしてください',
    premiumFeature: 'プレミアム機能',
    conditionalRenderingWithHook: '5. フックを使った条件付きレンダリング',
    viewUsersHookBased: 'ユーザーを表示（フックベース）',
    permissionInformation: '権限情報',
    permissionInfoText: 'このデモでは、ボタンレベルの認可を実装するさまざまな方法を示しています。権限デバッガー（右下）を使用して、さまざまなシナリオをテストしてください。',
    
    // Home page
    welcome: 'ようこそ',
    
    // Alerts
    itemDeleted: 'アイテムが削除されました！',
    noDeletePermission: '削除する権限がありません',
    editingItem: 'アイテムを編集中...',
    noEditPermission: '編集する権限がありません',
    
    // AuthorizedComponent
    loading: '読み込み中...',
    
    // PermissionDebugger
    debugPermissions: '🔐 権限をデバッグ',
    permissionDebugger: '🔐 権限デバッガー',
    userInfo: 'ユーザー情報',
    id: 'ID',
    username: 'ユーザー名',
    roles: 'ロール',
    none: 'なし',
    noUserLoggedIn: 'ユーザーがログインしていません',
    currentPermissions: '現在の権限',
    noPermissions: '権限がありません',
    testPermission: '権限をテスト',
    test: 'テスト',
    accessGranted: '✓ アクセス許可',
    accessDenied: '✗ アクセス拒否',
    permissionPlaceholder: '例: admin.delete',
    
    // Tenant Management
    tenantManagement: 'テナント管理',
    tenantName: 'テナント名',
    tenantDetails: 'テナント詳細',
    createTenant: 'テナント作成',
    searchTenants: 'テナントを検索...',
    filterByStatus: 'ステータスでフィルター',
    filterByPlan: 'プランでフィルター',
    allStatuses: 'すべてのステータス',
    allPlans: 'すべてのプラン',
    status: 'ステータス',
    active: '有効',
    inactive: '無効',
    suspended: '停止中',
    plan: 'プラン',
    free: '無料',
    basic: 'ベーシック',
    premium: 'プレミアム',
    enterprise: 'エンタープライズ',
    createdAt: '作成日',
    noTenantsFound: 'テナントが見つかりません',
    previous: '前へ',
    next: '次へ',
    pageXofY: '{{current}} / {{total}} ページ',
    back: '戻る',
    delete: '削除',
    save: '保存',
    saving: '保存中...',
    cancel: 'キャンセル',
    create: '作成',
    creating: '作成中...',
    confirm: '確認',
    add: '追加',
    remove: '削除',
    assign: '割り当て',
    basicInformation: '基本情報',
    subscriptionManagement: 'サブスクリプション管理',
    subscription: 'サブスクリプション',
    startDate: '開始日',
    endDate: '終了日',
    optional: '任意',
    allowedDomains: '許可ドメイン',
    enterDomain: 'ドメインを入力 (例: example.com)',
    noDomains: 'ドメインが設定されていません',
    tenantAdmins: 'テナント管理者',
    assignAdmin: '管理者を割り当て',
    noAdmins: '管理者が割り当てられていません',
    searchUsers: 'ユーザーを検索...',
    confirmDelete: '削除の確認',
    confirmDeleteMessage: 'このテナントを削除してもよろしいですか？この操作は元に戻せません。',
    tenantNameRequired: 'テナント名は必須です',
    startDateRequired: '開始日は必須です',
    endDateMustBeAfterStart: '終了日は開始日より後でなければなりません',
    invalidDomainFormat: 'ドメインの形式が無効です',
    enterTenantName: 'テナント名を入力',
    confirmCreateTenant: 'テナント作成の確認',
    confirmCreateMessage: '作成前にテナント情報を確認してください:',
    tenantUpdatedSuccessfully: 'テナントが正常に更新されました！',
    adminAssignedSuccessfully: '管理者が正常に割り当てられました！',
    adminRemovedSuccessfully: '管理者が正常に削除されました！',
    failedToUpdateTenant: 'テナントの更新に失敗しました。もう一度お試しください。',
    failedToAssignAdmin: '管理者の割り当てに失敗しました。もう一度お試しください。',
    failedToRemoveAdmin: '管理者の削除に失敗しました。もう一度お試しください。',
    failedToDeleteTenant: 'テナントの削除に失敗しました。もう一度お試しください。',
    failedToCreateTenant: 'テナントの作成に失敗しました。もう一度お試しください。',
    
    // User Management
    userManagement: 'ユーザー管理',
    createUser: 'ユーザー作成',
    userDetails: 'ユーザー詳細',
    email: 'メールアドレス',
    password: 'パスワード',
    userType: 'ユーザータイプ',
    internal: '内部',
    external: '外部',
    allUserTypes: 'すべてのユーザータイプ',
    tenants: 'テナント',
    noTenants: 'テナントなし',
    noUsersFound: 'ユーザーが見つかりません',
    enterUsername: 'ユーザー名を入力',
    enterEmail: 'メールアドレスを入力',
    enterPassword: 'パスワードを入力',
    passwordHelp: '最低8文字',
    usernameRequired: 'ユーザー名は必須です',
    emailRequired: 'メールアドレスは必須です',
    passwordRequired: 'パスワードは必須です',
    passwordTooShort: 'パスワードは8文字以上である必要があります',
    invalidEmail: 'メールアドレスの形式が無効です',
    validatingEmail: 'メールアドレスを検証中...',
    emailDomainInternal: 'メールドメインは内部ドメインのようです',
    emailDomainExternal: 'メールドメインは外部ドメインのようです',
    primaryTenant: 'プライマリテナント',
    selectTenant: 'テナントを選択...',
    createUserFailed: 'ユーザーの作成に失敗しました',
    updateUserFailed: 'ユーザーの更新に失敗しました',
    deleteUserFailed: 'ユーザーの削除に失敗しました',
    userNotFound: 'ユーザーが見つかりません',
    userUpdated: 'ユーザーが正常に更新されました',
    deleteUser: 'ユーザーを削除',
    confirmDeleteUser: 'このユーザーを削除してもよろしいですか？',
    updatedAt: '更新日',
    tenantAssignments: 'テナント割り当て',
    noTenantAssignments: 'テナント割り当てがありません',
    manageTenants: 'テナント管理',
    addTenant: 'テナント追加',
    selectRoles: 'ロールを選択',
    pleaseSelectTenantAndRoles: 'テナントと少なくとも1つのロールを選択してください',
    assignTenantFailed: 'テナントの割り当てに失敗しました',
    removeTenantFailed: 'テナントの削除に失敗しました',
    confirmRemoveTenant: 'このテナント割り当てを削除してもよろしいですか？',
    adding: '追加中...',
    edit: '編集',
    primary: 'プライマリ',
    secondary: 'セカンダリ',
    tenantInformation: 'テナント情報',
    removeTenant: 'テナントを削除',
    saveChanges: '変更を保存',
    pleaseSelectAtLeastOneRole: '少なくとも1つのロールを選択してください',
    rolesUpdated: 'ロールが正常に更新されました',
    updateRolesFailed: 'ロールの更新に失敗しました',
    selected: '選択済み',
    selectAction: 'アクションを選択...',
    setActive: '有効にする',
    setInactive: '無効にする',
    setSuspended: '停止する',
    deleteSelected: '削除',
    apply: '適用',
    selectAll: 'すべて選択',
    bulkOperationFailed: '一括操作に失敗しました',
    
    // Service Management
    serviceCatalog: 'サービスカタログ',
    serviceManagement: 'サービス管理',
    services: 'サービス',
    serviceDetails: 'サービス詳細',
    category: 'カテゴリ',
    allCategories: 'すべてのカテゴリ',
    storage: 'ストレージ',
    communication: 'コミュニケーション',
    analytics: 'アナリティクス',
    security: 'セキュリティ',
    integration: '統合',
    available: '利用可能',
    beta: 'ベータ',
    comingSoon: '近日公開',
    requiredPlan: '必要プラン',
    version: 'バージョン',
    features: '機能',
    enabledFeatures: '有効な機能',
    viewDetails: '詳細を表示',
    closeDetails: '閉じる',
    searchServices: 'サービスを検索...',
    noServicesFound: 'サービスが見つかりません',
    tenantServiceAssignment: 'テナント別サービス割り当て',
    serviceAssignment: 'サービス割り当て',
    assignServices: 'サービスを割り当て',
    enableService: 'サービスを有効化',
    disableService: 'サービスを無効化',
    serviceEnabled: 'サービスが有効化されました',
    serviceDisabled: 'サービスが無効化されました',
    planRestriction: 'プラン制限',
    upgradeRequired: 'アップグレードが必要です',
    featureFlags: '機能フラグ',
    toggleFeature: '機能の切り替え',
    featureName: '機能名',
    featureDescription: '説明',
    professionalPlan: 'Professional',
    serviceUpdatedSuccessfully: 'サービスが正常に更新されました',
    serviceUpdateFailed: 'サービスの更新に失敗しました',
    selectTenantFirst: '最初にテナントを選択してください',
    professional: 'Professional',
    orHigher: '以上',
    enabled: '有効',
    assigned: '割り当て日時:',
    
    // Dashboard
    dashboard: 'ダッシュボード',
    systemStatistics: 'システム統計',
    tenantStatistics: 'テナント統計',
    userStatistics: 'ユーザー統計',
    tenantsByPlan: 'プラン別テナント',
    serviceUsage: 'サービス使用状況',
    activityFeed: 'アクティビティフィード',
    noRecentActivity: '最近のアクティビティはありません',
    last7Days: '過去7日',
    last30Days: '過去30日',
    last90Days: '過去90日',
    allTime: 'すべての期間',
    performedBy: '実行者',
    
    // Global Search
    globalSearch: 'グローバル検索',
    searchPlaceholder: '検索... (Cmd+K または Ctrl+K)',
    searchKeywords: '検索キーワードを入力してください',
    noResultsFound: '結果が見つかりませんでした',
    searchResults: '件の結果',
    navigateWithArrows: '矢印キーで移動、Enterで選択、Escで閉じる',
    
    // Saved Filters
    savedFilters: '保存済みフィルター',
    selectFilter: 'フィルターを選択...',
    saveCurrentFilter: '現在のフィルターを保存',
    manageFilters: 'フィルター管理',
    saveFilter: 'フィルターを保存',
    filterName: 'フィルター名',
    filterNamePlaceholder: '例: アクティブなエンタープライズテナント',
    noSavedFilters: '保存されたフィルターがありません',
    filterNameRequired: 'フィルター名を入力してください',
    filterSaved: 'フィルターが保存されました',
    filterDeleted: 'フィルターが削除されました',
    deleteFilter: 'フィルターを削除',
    applyFilter: 'フィルターを適用',
    tenantFilters: 'テナントフィルター',
    userFilters: 'ユーザーフィルター',
    serviceFilters: 'サービスフィルター',
  },
};
