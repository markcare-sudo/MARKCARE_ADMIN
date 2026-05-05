/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import authService from "@/services/auth.service";
import { postErrorHandler } from "@/components/ErrorHandler";
import { successHandler } from "@/components/SuccessHandler";
import { apiStatusConstants } from "@/utils/api";
import {
  getAccessToken,
  clearSession,
  isTokenExpired,
  setUserData,
  setAccessToken,
  setRefreshToken,
  getUserData,
} from "@/utils/sessionStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUserData());
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [status, setStatus] = useState(apiStatusConstants.INITIAL);
  const [error, setError] = useState(null);

  // Reactive authentication check
  const isAuthenticated = useMemo(() => {
    const token = getAccessToken();
    return !!token && !isTokenExpired(token);
  }, [user]);

  const handleLogout = useCallback(() => {
    clearSession();
    setUser(null);
    setModules([]);
    setPermissions([]);
    setRoles([]);
    setActiveRole(null);
    setStatus(apiStatusConstants.INITIAL);
    window.location.href = "/login";
  }, []);

  /**
   * Sync Session Storage and State
   */
  const syncUserSession = useCallback(async (payload) => {
    const userData = payload?.user || payload;
    if (payload?.accessToken) await setAccessToken(payload.accessToken);
    if (payload?.refreshToken) await setRefreshToken(payload.refreshToken);
    if (userData) await setUserData(userData);

    setUser(userData);
  }, []);

  /**
   * HYDRATION: Load context on mount or refresh
   */
  const loadAuthContext = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setStatus(apiStatusConstants.SUCCESS);
      return;
    }

    if (isTokenExpired(token)) {
      handleLogout();
      return;
    }

    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await authService.getContext();

      // Update states from getContext API
      setUser(res.user || getUserData() || null);
      setModules(res.modules || []);
      setPermissions(res.permissions || []);
      setRoles(res.roles || []);
      setActiveRole(res.activeRole || null);

      setStatus(apiStatusConstants.SUCCESS);
    } catch (err) {
      setError(err);
      if (err?.response?.status === 401) {
        handleLogout();
      } else {
        setStatus(apiStatusConstants.FAILURE);
      }
    }
  }, [handleLogout]);

  // ================= AUTH ACTIONS =================

  // Note: These methods are exported mainly for legacy components
  // Prefer using the useAuth hook for authentication calls
  const verifyOTP = async (credentials) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const { data } = await authService.verifyLoginEmailOtp(credentials);
      await syncUserSession(data.data);
      successHandler(data);
      await loadAuthContext(); // Reload full context (modules/permissions)
      return data;
    } catch (error) {
      postErrorHandler(error);
      setStatus(apiStatusConstants.FAILURE);
      throw error;
    }
  };

  const selectRole = async (credentials) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const { data } = await authService.selectRole(credentials);
      await syncUserSession(data.data);
      successHandler(data);
      await loadAuthContext(); // Refresh permissions for the new role
      return data;
    } catch (error) {
      postErrorHandler(error);
      setStatus(apiStatusConstants.FAILURE);
      throw error;
    }
  };

  useEffect(() => {
    loadAuthContext();
  }, [loadAuthContext]);

  return (
    <AuthContext.Provider
      value={{
        error,

        // Data
        user,
        modules,
        permissions,
        roles,
        activeRole,
        status,
        isAuthenticated,
        loading: status === apiStatusConstants.IN_PROGRESS,

        // Actions
        logout: handleLogout,
        reloadContext: loadAuthContext,
        verifyOTP,
        selectRole,

        // State Setters (if needed for manual UI updates)
        setRoles,
        setActiveRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};



