// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
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

  // Helper function to check if current route is a customer-facing URL
  const checkIfCustomerRoute = (path: string) => {
    // Customer routes contain GUID pattern: /:guid or /:guid/checkout
    // GUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const guidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
    const customerRoutePattern = new RegExp(`^\\/${guidPattern}(?:\\/checkout)?$`);
    return customerRoutePattern.test(path);
  };

  const [isCustomerRoute, setIsCustomerRoute] = useState(() => {
    // Initialize with current path to avoid initial polling on customer routes
    return checkIfCustomerRoute(window.location.pathname);
  });

  // Listen for route changes
  useEffect(() => {
    const checkRoute = () => {
      setIsCustomerRoute(checkIfCustomerRoute(window.location.pathname));
    };

    // Check initially
    checkRoute();

    // Listen for route changes
    window.addEventListener('popstate', checkRoute);

    // Also check on any navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      checkRoute();
    };

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.history.pushState = originalPushState;
    };
  }, []);

  // Simple background polling - replaces complex background services
  // Don't poll on customer-facing routes
  useBackgroundPolling(isAuthenticated && isBusinessSetup && !isCustomerRoute);

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
