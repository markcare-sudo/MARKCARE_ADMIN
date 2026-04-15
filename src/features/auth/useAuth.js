import { useState } from "react";
import authService from "./auth.service";
import usersService from "@/services/users.service";
import { apiStatusConstants } from "@/utils/api";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import {
  getUserData,
  setAccessToken,
  setRefreshToken,
  setUserData,
  clearSession,
} from "@/utils/sessionStorage";


const useAuth = () => {
  const [status, setStatus] = useState(apiStatusConstants.INITIAL);
  const user = getUserData();

  // Helper to handle session updates
  const updateSession = async (data) => {
    await setUserData(data.user);
    await setAccessToken(data.accessToken);
    await setRefreshToken(data.refreshToken);
  };

  // ================= VERIFY EMAIL LINK =================

  const verifyUser = async (token) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await usersService.verifyUser(token);

      successHandler(res)

      setStatus(apiStatusConstants.SUCCESS);
      // We don't call successHandler here usually because the UI page 
      // handles the success state visually
      return res;
    } catch (err) {
      setStatus(apiStatusConstants.FAILURE);
      throw err;
    }
  };

  // ================= LOGIN OTP =================

  const requestOTP = async (credentials) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const data = await authService.requestOtp(credentials);
      setStatus(apiStatusConstants.SUCCESS);
      successHandler(data);
      return data;
    } catch (error) {
      setStatus(apiStatusConstants.FAILURE);
      postErrorHandler(error);
      throw error;
    }
  };

  const verifyOTP = async (credentials) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const { data } = await authService.verifyOtp(credentials);

      await updateSession(data.data);

      setStatus(apiStatusConstants.SUCCESS);
      // successHandler(data);
      return data;
    } catch (error) {
      setStatus(apiStatusConstants.FAILURE);
      // postErrorHandler(error);
      throw error;
    }
  };

  const selectRole = async (credentials) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const { data } = await authService.selectRole(credentials);

      await updateSession(data.data);

      setStatus(apiStatusConstants.SUCCESS);
      successHandler(data);
      return data;
    } catch (error) {
      setStatus(apiStatusConstants.FAILURE);
      postErrorHandler(error);
      throw error;
    }
  };

  // ================= LOGOUT =================

  const logout = () => {
    clearSession();
    window.location.href = "/login";
  };

  return {
    verifyUser,
    requestOTP,
    verifyOTP,
    selectRole,
    logout,
    status, // Returning status instead of loading
    user,
  };
};

export default useAuth;




