import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken, getUserData } from "@/utils/sessionStorage";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = getAccessToken();
  const userData = getUserData();

  // ❌ No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ❌ Token exists but no user (invalid/expired session)
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Optional: restrict only platform users (admin side)

  if (!userData?.is_platform_user) {

    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;