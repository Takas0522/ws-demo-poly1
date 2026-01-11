# Frontend Button-Level Authorization System

This is a comprehensive React-based authorization system that provides button-level permission controls for frontend applications with full Japanese/English language support.

## 🎯 Features

- ✅ `<AuthorizedComponent>` wrapper for declarative permission checks
- ✅ Permission-based button visibility
- ✅ Loading states for permission checks
- ✅ Permission context provider with React Context
- ✅ Permission debugging tools
- ✅ TypeScript support for type safety
- ✅ Performance optimized with React hooks
- ✅ Wildcard permission support
- ✅ Multiple permission strategies (any/all)
- ✅ **Japanese/English bilingual support (日本語・英語対応)**

## 📦 Installation

```bash
cd src/front
npm install
```

## 🚀 Usage

### 1. Wrap your app with I18nProvider and PermissionProvider

```tsx
import { I18nProvider } from './i18n/I18nContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const fetchUserPermissions = async () => {
  const response = await fetch('/api/user/permissions');
  return response.json();
};

function App() {
  return (
    <I18nProvider defaultLanguage="ja">
      <PermissionProvider fetchUserPermissions={fetchUserPermissions}>
        <YourApp />
        <LanguageSwitcher position="top-right" />
      </PermissionProvider>
    </I18nProvider>
  );
}
```

### 2. Use AuthorizedComponent for UI elements

```tsx
import { AuthorizedComponent } from './components/AuthorizedComponent';

// Simple usage
<AuthorizedComponent permissions="admin.delete">
  <button>Delete</button>
</AuthorizedComponent>

// Multiple permissions (any one)
<AuthorizedComponent permissions={["editor.edit", "admin.edit"]}>
  <button>Edit</button>
</AuthorizedComponent>

// Require all permissions
<AuthorizedComponent 
  permissions={["admin.view", "admin.edit"]} 
  requireAll
>
  <button>Admin Panel</button>
</AuthorizedComponent>

// With fallback content
<AuthorizedComponent 
  permissions="premium.feature"
  fallback={<div>Upgrade to access this feature</div>}
>
  <PremiumFeature />
</AuthorizedComponent>
```

### 3. Use hooks for programmatic checks

```tsx
import { useAuthorization } from './hooks/useAuthorization';

function MyComponent() {
  const { hasPermission, checkAndExecute } = useAuthorization();

  const handleDelete = checkAndExecute(
    'admin.delete',
    () => deleteItem(),
    () => alert('Unauthorized')
  );

  return (
    <div>
      {hasPermission('admin.view') && <AdminPanel />}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

### 4. Use translations in your components

```tsx
import { useI18n } from './i18n/I18nContext';

function MyComponent() {
  const { t, language, setLanguage } = useI18n();
  
  return (
    <div>
      <h1>{t.authorizationDemo}</h1>
      {/* 日本語: 認可デモ / English: Authorization Demo */}
      <button onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}>
        Switch Language
      </button>
    </div>
  );
}
```

### 5. Use Permission Debugger (Development)

```tsx
import { PermissionDebugger } from './components/PermissionDebugger';

{process.env.NODE_ENV === 'development' && (
  <PermissionDebugger position="bottom-right" />
)}
```

## 🌐 Internationalization

The system supports Japanese and English languages:

- **Default**: Japanese (日本語)
- **Supported**: English, Japanese
- **Switcher**: `<LanguageSwitcher />` component
- **Hook**: `useI18n()` for programmatic access

See [I18N.md](./I18N.md) for detailed internationalization documentation.

## 🏗️ Architecture

### Core Components

1. **PermissionProvider** - Context provider that manages permission state
2. **AuthorizedComponent** - Wrapper component for declarative authorization
3. **PermissionDebugger** - Development tool for debugging permissions
4. **I18nProvider** - Internationalization context provider
5. **LanguageSwitcher** - Component for language switching
6. **useAuthorization** - Hook for programmatic permission checks
7. **usePermissions** - Low-level hook for accessing permission context
8. **useI18n** - Hook for accessing translations

### Type System

```typescript
interface User {
  id: string;
  username: string;
  roles: string[];
  permissions: Permission[];
}

interface PermissionCheckOptions {
  requireAll?: boolean;
  onUnauthorized?: () => void;
}
```

## 🧪 Development

### Run the demo application

```bash
npm run dev
```

Open http://localhost:3000 to see the demo.

### Build for production

```bash
npm run build
```

## 📊 Permission Format

Permissions follow a hierarchical dot notation:

- `admin.delete` - Admin delete permission
- `editor.edit` - Editor edit permission
- `user.view` - User view permission
- `premium.feature` - Premium feature access

### Wildcard Support

The system supports wildcard permissions:

- `admin.*` - Grants all admin permissions
- `*` - Grants all permissions

## 🔒 Security Considerations

1. **Backend Validation**: Always validate permissions on the backend. Frontend authorization is for UX only.
2. **Token Security**: Store authentication tokens securely (httpOnly cookies recommended).
3. **Permission Refresh**: Refresh permissions periodically or after critical actions.
4. **Audit Logging**: Log permission checks for security auditing.

## 🎨 Customization

### Custom Loading Component

```tsx
<AuthorizedComponent 
  permissions="admin.delete"
  showLoader={false}
>
  <button>Delete</button>
</AuthorizedComponent>
```

### Custom Unauthorized Handler

```tsx
<AuthorizedComponent 
  permissions="admin.delete"
  onUnauthorized={() => {
    analytics.track('unauthorized_access_attempt');
  }}
>
  <button>Delete</button>
</AuthorizedComponent>
```

## 📈 Performance Optimization

- Permissions are cached in context to avoid repeated checks
- Uses React.memo and useCallback for optimal re-rendering
- Lazy loading states prevent unnecessary loading indicators

## 🤝 Integration with Backend

The system is designed to integrate with any backend authorization system. Simply implement the `fetchUserPermissions` function to call your API:

```typescript
const fetchUserPermissions = async (): Promise<User | null> => {
  const response = await fetch('/api/auth/permissions', {
    credentials: 'include', // Include cookies
  });
  
  if (!response.ok) {
    return null;
  }
  
  return response.json();
};
```

## 📝 License

This code is part of the ws-demo-poly1 project.
