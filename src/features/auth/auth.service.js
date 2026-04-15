import apiClient from "@/utils/api";


const requestOtp = async (payload) => {
  return await apiClient.post("/auth/request-otp", payload);
};


const verifyOtp = async (payload) => {
  return await apiClient.post("/auth/verify-otp", payload);
};


const selectRole = async (payload) => {
  return await apiClient.post("/auth/login/select-role", payload);
};


const logout = async () => {
  return await apiClient.post("/auth/login/logout");
};


const authService = {
  requestOtp,
  verifyOtp,

  selectRole,

  logout
};

export default authService;
