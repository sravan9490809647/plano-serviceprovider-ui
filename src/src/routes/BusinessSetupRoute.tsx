import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BusinessSetupRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isBusinessSetup } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isBusinessSetup) {
    // already setup → redirect to dashboard
    return <Navigate to="/orders" replace />;
  }

  return <>{children}</>;
};

export default BusinessSetupRoute;
