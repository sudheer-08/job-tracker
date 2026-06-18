import axios from "axios";
import { getStoredToken, clearAuthStorage } from "../utils/authStorage";

const PRODUCTION_API_URL = "https://job-tracker-wyhp.onrender.com";

// Render + Vercel environments: always prefer VITE_API_URL when provided.
// Vercel sets import.meta.env.PROD=true, but we still don't want to hard-fallback
// to an unexpected value.


const normalizeApiUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url.replace(/\/$/, "");
  return `https://${url.replace(/\/$/, "")}`;
};

const resolveBaseURL = () => {
  const envUrl = normalizeApiUrl(import.meta.env.VITE_API_URL);

  if (import.meta.env.PROD) {
    // In production (Vercel/Render builds), prefer VITE_API_URL if provided.
    // If it's missing, fall back to the known Render API URL.
    if (envUrl && !envUrl.includes("localhost")) return envUrl;
    return PRODUCTION_API_URL;
  }

  return envUrl || "http://localhost:5000";

};

const api = axios.create({
  baseURL: resolveBaseURL(),
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
