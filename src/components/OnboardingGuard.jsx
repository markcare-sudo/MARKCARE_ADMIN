import useAuth from "@/features/auth/useAuth";
import { Navigate } from "react-router-dom";

const OnboardingGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // If onboarding already completed → go to dashboard
  if (user?.onboarding_status === "COMPLETED") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default OnboardingGuard;