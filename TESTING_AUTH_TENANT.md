# Authentication Flow & Tenant Selection UI - Test Guide

## Overview
This document provides testing guidance for the authentication flow and tenant selection features implemented in Phase 4C-2.

## Components to Test

### 1. LoginPage Component (`src/pages/LoginPage.tsx`)

**Manual Testing Steps:**

1. **Navigate to Login Page**
   - URL: `/login`
   - Verify the page displays with proper styling

2. **Form Validation**
   - Try submitting with empty fields → Should show error
   - Try submitting with invalid email format → Should show error
   - Try submitting with valid credentials → Should call login API

3. **Error Handling**
   - Test with external user type → Should show "外部ユーザーはこのインターフェースからログインできません"
   - Test with invalid credentials (401) → Should show "メールアドレスまたはパスワードが正しくありません"
   - Test with server error → Should show generic error message

4. **Loading State**
   - During login, button should be disabled
   - Button should show spinner and "ログイン中..." text

5. **Successful Login**
   - Should redirect to home page (`/`)
   - User should be authenticated in AuthContext

### 2. TenantSelector Component (`src/components/TenantSelector.tsx`)

**Manual Testing Steps:**

1. **Display Conditions**
   - Component should NOT display if user is not authenticated
   - Component should NOT display if user has no tenants
   - Component SHOULD display if user is authenticated with tenants

2. **Dropdown Interaction**
   - Click on button → Dropdown menu should open
   - Click outside dropdown → Menu should close
   - Click on backdrop → Menu should close

3. **Tenant List**
   - Should display all available tenants
   - Each tenant should show name and roles
   - Currently selected tenant should have checkmark icon
   - Currently selected tenant should have blue background

4. **Tenant Switching**
   - Click on different tenant → Should call switchTenant API
   - After switching → Page should reload (temporary implementation)
   - Selected tenant should be updated in AuthContext

5. **Loading State**
   - During tenant switch, button should be disabled

### 3. AuthContext (`src/contexts/AuthContext.tsx`)

**State Management Testing:**

1. **Initial State**
   - `user`: null
   - `isAuthenticated`: false
   - `isLoading`: true (until refresh completes)
   - `selectedTenant`: null
   - `tenants`: []

2. **After Login**
   - `user`: populated with user data
   - `isAuthenticated`: true
   - `isLoading`: false
   - `selectedTenant`: first tenant from tenants array
   - `tenants`: populated from user data

3. **After Logout**
   - All state should reset to initial values
   - Token should be cleared from localStorage

4. **External User Login**
   - Should throw error
   - Should not update auth state
   - Should not store token

## API Integration Points

### Required Backend Endpoints

1. **POST /auth/login**
   ```typescript
   Request: { email: string, password: string }
   Response: { 
     token: string, 
     user: {
       id: string,
       username: string,
       email: string,
       userType: 'internal' | 'external',
       roles: string[],
       permissions: string[],
       tenants: Array<{
         id: string,
         name: string,
         roles: string[]
       }>
     }
   }
   ```

2. **POST /auth/logout**
   ```typescript
   Request: (empty body)
   Response: success
   ```

3. **GET /auth/me**
   ```typescript
   Request: (uses Bearer token)
   Response: User object (same as login)
   ```

4. **POST /auth/switch-tenant**
   ```typescript
   Request: { tenantId: string }
   Response: { 
     access_token: string, 
     tenant: {
       id: string,
       name: string,
       roles: string[]
     }
   }
   ```

## Mock Data for Testing

Use this mock data in App.tsx for development:

```typescript
const mockUser = {
  id: '1',
  username: 'test_user',
  email: 'test@example.com',
  userType: 'internal' as const,
  roles: ['admin', 'editor'],
  permissions: ['user.view', 'user.edit', 'admin.view'],
  tenants: [
    {
      id: 'tenant-1',
      name: 'テナントA',
      roles: ['admin', 'editor'],
    },
    {
      id: 'tenant-2',
      name: 'テナントB',
      roles: ['viewer'],
    },
  ],
};
```

## Browser Console Testing

### Check AuthContext State
```javascript
// In browser console, check if user is authenticated
console.log(localStorage.getItem('authToken'));
```

### Trigger Login Manually
```javascript
// You can test login flow from console
const login = async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });
  console.log(await response.json());
};
login();
```

## Known Limitations

1. **Page Reload on Tenant Switch**
   - Currently reloads entire page to refresh permissions
   - TODO: Implement graceful permission refresh without reload

2. **No Password Reset**
   - Password reset functionality not implemented
   - Users should contact administrator

3. **No Remember Me**
   - Session is based on localStorage token
   - No "Remember Me" option currently

## Automated Testing (Future)

When test infrastructure is set up, create these tests:

### Unit Tests
- [ ] LoginPage form validation
- [ ] TenantSelector rendering logic
- [ ] AuthContext state transitions
- [ ] Login error handling

### Integration Tests
- [ ] Login flow end-to-end
- [ ] Tenant switching flow
- [ ] Logout flow
- [ ] Protected route access

### E2E Tests
- [ ] Complete authentication journey
- [ ] Multi-tenant switching
- [ ] Session persistence

## Acceptance Criteria Checklist

- [x] Login screen implemented with Tailwind CSS
- [x] userType='external' login error is displayed
- [x] Tenant selection dropdown in header
- [x] Tenant switching works correctly
- [x] Loading states are properly displayed
- [ ] Unit tests created (test infrastructure needed)

## Security Considerations

- ✅ Passwords are never logged or displayed
- ✅ Tokens are stored securely in localStorage
- ✅ External users cannot login
- ✅ API errors don't expose sensitive information
- ✅ CSRF protection via Bearer tokens
- ✅ No XSS vulnerabilities (CodeQL verified)

## Performance Notes

- Login page loads instantly (no external dependencies)
- Tenant selector renders only when needed
- Dropdown uses React state for instant UI updates
- Page reload on tenant switch may cause brief loading state
