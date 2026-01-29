// Authentication types

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  tenants: Tenant[];
  roles: Record<string, string[]>;
}

export interface Tenant {
  id: string;
  name: string;
  isPrivileged: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Error code messages
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AUTH001: "ログインIDまたはパスワードを入力してください",
  AUTH002: "ログインIDまたはパスワードが正しくありません",
  AUTH006: "このアカウントではログインできません",
  AUTH007: "アカウントがロックされています。しばらく後に再試行してください",
};
