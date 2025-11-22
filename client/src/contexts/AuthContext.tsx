// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Admin {
  id: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (admin: Admin, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_KEY = "admin";
const TOKEN_KEY = "adminToken";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem(ADMIN_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedAdmin && storedToken) {
      try {
        const parsed = JSON.parse(storedAdmin);
        if (parsed?.email && parsed?.id) {
          setAdmin(parsed);
          setToken(storedToken);
        }
      } catch (e) {
        console.warn("Données d'auth corrompues, nettoyage...");
        localStorage.removeItem(ADMIN_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoaded(true);
  }, []);

  const login = (adminData: Admin, authToken: string) => {
    setAdmin(adminData);
    setToken(authToken);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));
    localStorage.setItem(TOKEN_KEY, authToken);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  if (!loaded) {
    return null; // évite le flash de non-connecté
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin && !!token,
        isReady: loaded,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};