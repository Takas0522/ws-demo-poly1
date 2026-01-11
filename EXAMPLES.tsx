/**
 * Usage Examples for Frontend Authorization System
 * 
 * This file demonstrates various patterns for implementing
 * button-level authorization in your React application.
 */

import React from 'react';
import {
  PermissionProvider,
  AuthorizedComponent,
  useAuthorization,
  usePermissions,
  PermissionDebugger,
} from './index';
import type { User } from './types/permission';

// ============================================================================
// EXAMPLE 1: Setting up the Permission Provider
// ============================================================================

/**
 * Fetch user permissions from your backend API
 */
const fetchUserPermissions = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/user', {
      credentials: 'include', // Include cookies
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user permissions:', error);
    return null;
  }
};

/**
 * Wrap your root component with PermissionProvider
 */
export const AppWithPermissions: React.FC = () => {
  return (
    <PermissionProvider fetchUserPermissions={fetchUserPermissions}>
      <YourApp />
      {/* Add debugger in development */}
      {process.env.NODE_ENV === 'development' && <PermissionDebugger />}
    </PermissionProvider>
  );
};

// ============================================================================
// EXAMPLE 2: Basic Button Authorization
// ============================================================================

export const BasicButtonExample: React.FC = () => {
  return (
    <div>
      {/* Only show delete button to users with admin.delete permission */}
      <AuthorizedComponent permissions="admin.delete">
        <button onClick={() => console.log('Deleting...')}>
          Delete
        </button>
      </AuthorizedComponent>
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Multiple Permissions (Any One)
// ============================================================================

export const MultiplePermissionsExample: React.FC = () => {
  return (
    <div>
      {/* Show button if user has either editor.edit OR admin.edit */}
      <AuthorizedComponent permissions={['editor.edit', 'admin.edit']}>
        <button onClick={() => console.log('Editing...')}>
          Edit
        </button>
      </AuthorizedComponent>
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: Require All Permissions
// ============================================================================

export const RequireAllPermissionsExample: React.FC = () => {
  return (
    <div>
      {/* Show button only if user has BOTH permissions */}
      <AuthorizedComponent
        permissions={['admin.view', 'admin.edit']}
        requireAll
      >
        <button onClick={() => console.log('Admin action...')}>
          Admin Panel
        </button>
      </AuthorizedComponent>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Fallback Content
// ============================================================================

export const FallbackContentExample: React.FC = () => {
  return (
    <div>
      {/* Show upgrade message if user doesn't have permission */}
      <AuthorizedComponent
        permissions="premium.feature"
        fallback={
          <div style={{ padding: '10px', backgroundColor: '#ffc107' }}>
            Upgrade to Premium to access this feature
          </div>
        }
      >
        <button onClick={() => console.log('Premium feature...')}>
          Premium Feature
        </button>
      </AuthorizedComponent>
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Unauthorized Callback
// ============================================================================

export const UnauthorizedCallbackExample: React.FC = () => {
  const handleUnauthorized = () => {
    console.log('User attempted unauthorized access');
    // Track analytics, show notification, etc.
  };

  return (
    <div>
      <AuthorizedComponent
        permissions="admin.delete"
        onUnauthorized={handleUnauthorized}
        fallback={<div>Insufficient permissions</div>}
      >
        <button onClick={() => console.log('Deleting...')}>
          Delete
        </button>
      </AuthorizedComponent>
    </div>
  );
};

// ============================================================================
// EXAMPLE 7: Using Hooks for Conditional Rendering
// ============================================================================

export const HookBasedExample: React.FC = () => {
  const { hasPermission, user } = useAuthorization();

  return (
    <div>
      <h3>Welcome, {user?.username}!</h3>
      
      {/* Simple conditional rendering */}
      {hasPermission('user.view') && (
        <button>View Users</button>
      )}
      
      {/* Check multiple permissions */}
      {hasPermission(['admin.view', 'admin.edit'], { requireAll: true }) && (
        <button>Admin Dashboard</button>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 8: Check and Execute Pattern
// ============================================================================

export const CheckAndExecuteExample: React.FC = () => {
  const { checkAndExecute } = useAuthorization();

  const handleDelete = checkAndExecute(
    'admin.delete',
    () => {
      // This code runs only if user has permission
      console.log('Deleting item...');
      // Call delete API
    },
    () => {
      // This code runs if user doesn't have permission
      alert('You do not have permission to delete');
    }
  );

  return <button onClick={handleDelete}>Delete</button>;
};

// ============================================================================
// EXAMPLE 9: Filtering Lists by Permission
// ============================================================================

interface MenuItem {
  id: string;
  label: string;
  action: () => void;
  permission?: string;
}

export const FilteredMenuExample: React.FC = () => {
  const { filterByPermission } = useAuthorization();

  const menuItems: MenuItem[] = [
    { id: '1', label: 'View', action: () => {}, permission: 'user.view' },
    { id: '2', label: 'Edit', action: () => {}, permission: 'editor.edit' },
    { id: '3', label: 'Delete', action: () => {}, permission: 'admin.delete' },
    { id: '4', label: 'Settings', action: () => {} }, // No permission required
  ];

  const allowedItems = filterByPermission(menuItems, (item) => item.permission);

  return (
    <ul>
      {allowedItems.map((item) => (
        <li key={item.id}>
          <button onClick={item.action}>{item.label}</button>
        </li>
      ))}
    </ul>
  );
};

// ============================================================================
// EXAMPLE 10: Complex Permission Logic
// ============================================================================

export const ComplexPermissionExample: React.FC = () => {
  const { hasPermission, user } = usePermissions();

  const canEditOwnPost = (postAuthorId: string) => {
    return user?.id === postAuthorId && hasPermission('user.edit.own');
  };

  const canEditAnyPost = () => {
    return hasPermission('editor.edit.any') || hasPermission('admin.edit');
  };

  const canEditPost = (postAuthorId: string) => {
    return canEditOwnPost(postAuthorId) || canEditAnyPost();
  };

  // Example usage
  const postAuthorId = '123';

  return (
    <div>
      {canEditPost(postAuthorId) && (
        <button onClick={() => console.log('Editing post...')}>
          Edit Post
        </button>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 11: Loading States
// ============================================================================

export const LoadingStateExample: React.FC = () => {
  const { isLoading, permissions } = usePermissions();

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div>
      <h3>Your Permissions ({permissions.length})</h3>
      <ul>
        {permissions.map((perm, index) => (
          <li key={index}>{perm}</li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// EXAMPLE 12: Refreshing Permissions
// ============================================================================

export const RefreshPermissionsExample: React.FC = () => {
  const { refreshPermissions, isLoading } = usePermissions();

  const handleRefresh = async () => {
    await refreshPermissions();
    console.log('Permissions refreshed');
  };

  return (
    <button onClick={handleRefresh} disabled={isLoading}>
      {isLoading ? 'Refreshing...' : 'Refresh Permissions'}
    </button>
  );
};

// ============================================================================
// Mock App Component
// ============================================================================

const YourApp: React.FC = () => {
  return (
    <div>
      <h1>Your Application</h1>
      {/* Your application components */}
    </div>
  );
};
