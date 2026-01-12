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
  },
};
