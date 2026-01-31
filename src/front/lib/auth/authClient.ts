// Authentication API client
import type { LoginRequest, User } from "./types";
import { AUTH_ERROR_MESSAGES } from "./types";

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8001";

// Helper function to decode JWT payload (client-side only)
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Helper function to set cookie
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Helper function to delete cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// Helper function to extract user from JWT
function extractUserFromToken(accessToken: string): User | null {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return null;

  return {
    id: payload.sub as string,
    name: payload.name as string,
    tenants: (payload.tenants as User["tenants"]) || [],
    roles: (payload.roles as User["roles"]) || {},
  };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginResult {
  tokens: TokenResponse;
  user: User;
}

export class AuthClient {
  /**
   * Login with credentials
   */
  static async login(loginId: string, password: string): Promise<LoginResult> {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginId, password } as LoginRequest),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: {
          code: "AUTH002",
          message: AUTH_ERROR_MESSAGES.AUTH002,
        },
      }));
      throw error.error || error;
    }

    const tokens: TokenResponse = await response.json();
    
    // Store tokens in cookies
    setCookie("access_token", tokens.accessToken, 1); // 1 day
    setCookie("refresh_token", tokens.refreshToken, 7); // 7 days

    // Extract user from JWT
    const user = extractUserFromToken(tokens.accessToken);
    if (!user) {
      throw { code: "AUTH002", message: "Failed to extract user info from token" };
    }

    return { tokens, user };
  }

  /**
   * Verify current authentication status
   */
  static async verify(token?: string): Promise<User> {
    // If no token provided, try to get from cookie
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(/access_token=([^;]+)/);
      token = match ? match[1] : undefined;
    }

    if (!token) {
      throw new Error("No access token available");
    }

    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Authentication verification failed");
    }

    return response.json();
  }

  /**
   * Refresh access token
   */
  static async refresh(): Promise<TokenResponse> {
    // Get refresh token from cookie
    let refreshToken: string | undefined;
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/refresh_token=([^;]+)/);
      refreshToken = match ? match[1] : undefined;
    }

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const tokens: TokenResponse = await response.json();
    
    // Update cookies
    setCookie("access_token", tokens.accessToken, 1);
    setCookie("refresh_token", tokens.refreshToken, 7);

    return tokens;
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    // Delete cookies
    deleteCookie("access_token");
    deleteCookie("refresh_token");
  }

  /**
   * Get user from stored token
   */
  static getUserFromStoredToken(): User | null {
    if (typeof document === "undefined") return null;
    
    const match = document.cookie.match(/access_token=([^;]+)/);
    if (!match) return null;
    
    return extractUserFromToken(match[1]);
  }
}
