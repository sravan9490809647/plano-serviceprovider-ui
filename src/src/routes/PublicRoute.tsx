import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isBusinessSetup } = useAuth();

  if (isAuthenticated) {
    return isBusinessSetup ? (
      <Navigate to="/orders" replace />
    ) : (
      <Navigate to="/business_setup" replace />
    );
  }

  return children;
};

export default PublicRoute;
