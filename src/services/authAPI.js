import api from "./api";
import { setAuth, clearAuth } from "./tokenStorage";

export async function login(email, password, remember = false) {
  const { data } = await api.post("/api/auth/login", { email, password });
  setAuth(data, remember); // data: { accessToken, refreshToken?, user }
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await api.post("/api/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
}

export async function requestOtp(email) {
  const { data } = await api.post("/api/auth/forgot-password/request-otp", {
    email,
  });
  return data; // { success: true }
}

export async function verifyOtp(email, otp) {
  const { data } = await api.post("/api/auth/forgot-password/verify-otp", {
    email,
    otp,
  });
  return data; // { resetToken }
}

export async function resetPassword(resetToken, newPassword) {
  const { data } = await api.post("/api/auth/forgot-password/reset", {
    resetToken,
    newPassword,
  });
  return data; // { success: true }
}

export async function refreshAccessToken() {
  const rt = getRefreshToken();
  if (!rt) throw new Error("No refresh token");
  const { data } = await api.post("/api/auth/refresh", { refreshToken: rt });
  // only accessToken is returned
  const storage = localStorage.getItem("refreshToken") ? localStorage : sessionStorage;
  storage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}

export async function serverLogout() {
  // optional: also call server to bump token_version
  try { await api.post("/api/auth/logout"); } catch {}
  clearAuth();
}
