import axios from "axios";
import {
  getAccessToken,
  removeAccessToken,
  clearUserData,
} from "./sessionStorage";

// export const API_BASE_URL = "http://localhost:3001/api/v1";

export const API_BASE_URL = 'https://server-89nw.onrender.com/api/v1'

export const apiStatusConstants = {
  INITIAL: "INITIAL",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  IN_PROGRESS: "IN_PROGRESS",
};

/* 🔥 Single Smart Axios Client */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeAccessToken();
      clearUserData();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;