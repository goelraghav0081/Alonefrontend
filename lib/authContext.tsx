// Auth Context - manages authentication state across the app
"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { tokenManager } from "./tokenManager";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    const hasToken = tokenManager.hasToken();

    if (storedUser && hasToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        tokenManager.clearTokens();
      }
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    tokenManager.clearTokens();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && tokenManager.hasToken(),
        isLoading,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
