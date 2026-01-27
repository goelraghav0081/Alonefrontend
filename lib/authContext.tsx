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
    // Restore session on page reload
    const storedUser = localStorage.getItem("user");
    const hasAccessToken = tokenManager.isAuthenticated();

    if (storedUser && hasAccessToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        tokenManager.clear();
      }
    }

    setIsLoading(false);
  }, []);

  const logout = async () => {
    setUser(null);
    tokenManager.clear();

    // Optional but recommended: tell backend to revoke refresh token
    await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && tokenManager.isAuthenticated(),
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
