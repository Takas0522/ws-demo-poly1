// Authentication API client
import type { LoginRequest, LoginResponse, User } from "./types";

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8001";

export class AuthClient {
  /**
   * Login with credentials
   */
  static async login(loginId: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginId, password } as LoginRequest),
      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: {
          code: "AUTH002",
          message: "ログインIDまたはパスワードが正しくありません",
        },
      }));
      throw error.error || error;
    }

    return response.json();
  }

  /**
   * Verify current authentication status
   */
  static async verify(): Promise<User> {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      method: "POST",
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
  static async refresh(): Promise<{ accessToken: string }> {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    return response.json();
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    await fetch(`${AUTH_SERVICE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  }
}
