import API from "./api";

export const loginAdmin = (email, password) =>
  API.post("/auth/login", { email, password });

export const getMe = () => API.get("/auth/me");

export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = (token, password) =>
  API.post(`/auth/reset-password/${token}`, { password });