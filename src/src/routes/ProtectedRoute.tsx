import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isBusinessSetup } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isBusinessSetup && location.pathname !== "/business_setup") {
    // Logged in but no setup → force to business_details unless already there
    return <Navigate to="/business_setup" replace />;
  }

  // Logged in and either: (a) business setup complete, or (b) currently on business_details
  return <>{children}</>;
};

export default ProtectedRoute;
