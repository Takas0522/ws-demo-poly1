import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import apiClient, { setAuthToken, clearAuthToken } from '../api/apiClient';
import { User, Tenant } from '../types/permission';

interface AuthState {
  user: User | null;
  selectedTenant: Tenant | null;
  tenants: Tenant[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider - Manages user authentication state
 * 
 * This component provides authentication functionality including:
 * - User login/logout
 * - Token management
 * - User session persistence
 * - Auto-refresh on mount
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    selectedTenant: null,
    tenants: [],
    isAuthenticated: false,
    isLoading: true,
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  /**
   * Refresh user data from backend
   */
  const refreshUser = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Call backend to get current user info with permissions
      const response = await apiClient.get<User>('/api/auth/me');
      
      // Extract tenants from user data
      const tenants = response.data.tenants || [];
      const selectedTenant = tenants.length > 0 ? tenants[0] : null;
      
      setAuthState({
        user: response.data,
        selectedTenant,
        tenants,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setAuthState({
        user: null,
        selectedTenant: null,
        tenants: [],
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  /**
   * Login user with credentials
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Call backend login endpoint
      const response = await apiClient.post<{ token: string; user: User }>('/api/auth/login', credentials);
      
      // Check if user is external type and reject
      if (response.data.user.userType === 'external') {
        throw new Error('External users cannot log in through this interface');
      }
      
      // Store token
      setAuthToken(response.data.token);
      
      // Extract tenants from user data
      const tenants = response.data.user.tenants || [];
      const selectedTenant = tenants.length > 0 ? tenants[0] : null;
      
      // Update auth state
      setAuthState({
        user: response.data.user,
        selectedTenant,
        tenants,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState({
        user: null,
        selectedTenant: null,
        tenants: [],
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear token and state regardless of backend response
      clearAuthToken();
      setAuthState({
        user: null,
        selectedTenant: null,
        tenants: [],
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  /**
   * Switch to a different tenant
   * 
   * Note: Currently reloads the page to ensure all permissions are refreshed.
   * In a production environment, consider refreshing permissions without reload
   * or implement a more granular permission update mechanism.
   */
  const switchTenant = useCallback(async (tenantId: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await apiClient.post<{ access_token: string; tenant: Tenant }>('/auth/switch-tenant', { tenantId });
      const { access_token, tenant } = response.data;
      
      // Update token
      setAuthToken(access_token);
      
      // Update selected tenant
      setAuthState(prev => ({
        ...prev,
        selectedTenant: tenant,
        isLoading: false,
      }));
      
      // Reload page to refresh permissions
      // TODO: Consider implementing permission refresh without full page reload
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Check authentication status on mount only
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInitialized]);

  const value: AuthContextValue = {
    ...authState,
    login,
    logout,
    refreshUser,
    switchTenant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access authentication context
 * 
 * @throws Error if used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * if (!isAuthenticated) {
 *   return <LoginPage />;
 * }
 * ```
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
