import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RedirectHome = () => {
  const { isAuthenticated, isBusinessSetup } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isBusinessSetup) {
    return <Navigate to="/orders" replace />;
  }

  return <Navigate to="/business_setup" replace />;
};

export default RedirectHome;
