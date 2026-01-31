"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, AuthState } from "./types";
import { AuthClient } from "./authClient";

interface AuthContextType extends AuthState {
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from stored token on mount
  useEffect(() => {
    const initAuth = () => {
      const storedUser = AuthClient.getUserFromStoredToken();
      setUser(storedUser);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (loginId: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await AuthClient.login(loginId, password);
      setUser(result.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthClient.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      await AuthClient.refresh();
      // Extract user from new token
      const storedUser = AuthClient.getUserFromStoredToken();
      setUser(storedUser);
    } catch {
      setUser(null);
      throw new Error("Token refresh failed");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
