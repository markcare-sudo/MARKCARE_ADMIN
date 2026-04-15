import { useState } from "react";
import profileService from "./profile.service";

const useProfile = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (apiCall) => {
    try {
      setLoading(true);
      const res = await apiCall();
      return res;
    } finally {
      setLoading(false);
    }
  };

  // ================= GET PROFILE =================
  const getProfile = () =>
    execute(() => profileService.getProfile());

  // ================= UPDATE PROFILE =================
  const updateProfile = (payload) =>
    execute(() => profileService.updateProfile(payload));

  // ================= AVATAR UPLOAD =================
  const uploadAvatar = (formData) =>
    execute(() => profileService.uploadAvatar(formData));

  // ================= EMAIL OTP =================
  const sendEmailOtp = (payload) =>
    execute(() => profileService.sendEmailOtp(payload));

  const verifyEmailOtp = (payload) =>
    execute(() => profileService.verifyEmailOtp(payload));

  // ================= PHONE OTP =================
  const sendPhoneOtp = (payload) =>
    execute(() => profileService.sendPhoneOtp(payload));

  const verifyPhoneOtp = (payload) =>
    execute(() => profileService.verifyPhoneOtp(payload));

  return {
    loading,

    // profile
    getProfile,
    updateProfile,
    uploadAvatar,

    // email otp
    sendEmailOtp,
    verifyEmailOtp,

    // phone otp
    sendPhoneOtp,
    verifyPhoneOtp,
  };
};

export default useProfile;