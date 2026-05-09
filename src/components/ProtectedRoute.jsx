import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken } from "@/utils/sessionStorage";
import { useAuthContext } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  const token = getAccessToken();

  // ⏳ Show loader while auth is being checked
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // ❌ No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ❌ Token exists but no user (invalid/expired session)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Optional: restrict only platform users (admin side)

  if (!user?.is_platform_user) {

    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;