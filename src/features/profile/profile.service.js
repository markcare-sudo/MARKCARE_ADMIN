import api from "@/lib/api";

const profileService = {
  getProfile: () => api.get("/profile"),

  updateProfile: (data) =>
    api.put("/profile", data),

  uploadAvatar: (formData) =>
    api.post("/profile/avatar", formData),

  sendEmailOtp: (data) =>
    api.post("/profile/send-email-otp", data),

  verifyEmailOtp: (data) =>
    api.post("/profile/verify-email-otp", data),

  sendPhoneOtp: (data) =>
    api.post("/profile/send-phone-otp", data),

  verifyPhoneOtp: (data) =>
    api.post("/profile/verify-phone-otp", data),
};

export default profileService;