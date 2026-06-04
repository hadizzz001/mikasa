"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// localStorage key holding the signed-in user so access survives reloads.
const STORAGE_KEY = "sana_user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Hydrate from localStorage on mount (kept in an effect to avoid SSR
  // hydration mismatches).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored) as AuthUser);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      /* storage may be unavailable */
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage may be unavailable */
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
