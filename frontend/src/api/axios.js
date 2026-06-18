import axios from "axios";
import { getStoredToken, clearAuthStorage } from "../utils/authStorage";

const normalizeApiUrl = (url) => {
  if (!url) return "http://localhost:5000";
  if (url.startsWith("http://") || url.startsWith("https://")) return url.replace(/\/$/, "");
  return `https://${url.replace(/\/$/, "")}`;
};

const api = axios.create({
  baseURL: normalizeApiUrl(import.meta.env.VITE_API_URL),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();

      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
