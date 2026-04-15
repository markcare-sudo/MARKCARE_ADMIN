import useAuth from "@/features/auth/useAuth";
import { Navigate } from "react-router-dom";

const DashboardGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // If onboarding not completed → force onboarding
  if (user?.onboarding_status !== "COMPLETED") {
    return <Navigate to="/onboarding/lab-setup" replace />;
  }

  return children;
};

export default DashboardGuard;