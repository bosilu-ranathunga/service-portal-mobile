import axios from "axios";
import { getAccessToken, clearAuth, getRefreshToken } from "./tokenStorage";
import { refreshAccessToken } from "./authAPI";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 15000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});


let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      p.resolve(token);
    }
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err?.response?.status;

    // If 401 and we have a refresh token, try to refresh once
    if (status === 401 && !original._retry && getRefreshToken()) {
      if (isRefreshing) {
        // queue the request until refresh finishes
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;
      try {
        const newAccess = await refreshAccessToken();
        processQueue(null, newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        processQueue(e, null);
        clearAuth();
        // optional: redirect to login
        // window.location.assign('/login');
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    // else: pass through normalized error
    const message =
      err?.response?.data?.message || err?.message || "Request failed";
    return Promise.reject({ status, message, data: err?.response?.data, original: err });
  }
);

export default api;
