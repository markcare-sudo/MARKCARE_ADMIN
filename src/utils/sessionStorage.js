// // Functions for handling user data
// const STORAGE_KEYS = {
//   USER: "iqlims_user",
//   ACCESS_TOKEN: "iqlims_access_token",
//   REFRESH_TOKEN: "iqlims_refresh_token",
// };


// export const setUserData = (userData) => {
//     localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
// };

// export const getUserData = () => {
//     const userDataString = localStorage.getItem(STORAGE_KEYS.USER);
//     return userDataString ? JSON.parse(userDataString) : null;
// };

// export const clearUserData = () => {
//     localStorage.removeItem(STORAGE_KEYS.USER);
// };

// // Functions for handling tokens
// export const setAccessToken = (token) => {
//     localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
// };

// export const getAccessToken = () => {
//     return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
// };

// export const setRefreshToken = (token) => {
//     localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
// };

// export const getRefreshToken = () => {
//     return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
// };

// export const removeAccessToken = () => {
//     localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
// };



// export const clearSession = () => {
//   localStorage.removeItem(STORAGE_KEYS.USER);
//   localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
//   localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
// };









// utils/sessionStorage.js

const STORAGE_KEYS = {
  USER: "markcare_user",
  ACCESS_TOKEN: "markcare_access_token",
  REFRESH_TOKEN: "markcare_refresh_token",
};

//
// ================= USER =================
//

export const setUserData = (userData) => {
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(userData)
  );
};

export const getUserData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearUserData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

//
// ================= ACCESS TOKEN =================
//

export const setAccessToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const removeAccessToken = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

//
// ================= REFRESH TOKEN =================
//

export const setRefreshToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

//
// ================= TOKEN EXPIRY CHECK =================
//

export const isTokenExpired = (token) => {
  try {
    if (!token) return true;

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

//
// ================= CLEAR FULL SESSION =================
//

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};