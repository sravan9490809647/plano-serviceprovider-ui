// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useBackgroundPolling } from "../hooks/useBackgroundPolling";

interface AuthContextType {
  isAuthenticated: boolean;
  isBusinessSetup: boolean;
  login: (businessSetup: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
  const [isBusinessSetup, setIsBusinessSetup] = useState(() => {
    const stored = localStorage.getItem("businessSetup");
    return stored === "true";
  });

  // Simple background polling - replaces complex background services
  useBackgroundPolling(isAuthenticated && isBusinessSetup);

  const login = (businessSetup: boolean) => {
    setIsAuthenticated(true);
    setIsBusinessSetup(businessSetup);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("businessSetup");
    localStorage.removeItem("businessId");
    setIsAuthenticated(false);
    setIsBusinessSetup(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isBusinessSetup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
