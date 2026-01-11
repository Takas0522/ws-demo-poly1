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
  },
};
