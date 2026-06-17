import api from "./axios";

export const getDashboardOverview = () => api.get("/api/dashboard/overview");

export const getDashboardStats = () => api.get("/api/dashboard/stats");
