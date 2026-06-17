import api from "./axios";

export const getApplications = (params) =>
  api.get("/api/applications", { params });

export const getApplication = (id) => api.get(`/api/applications/${id}`);

export const createApplication = (data) => api.post("/api/applications", data);

export const updateApplication = (id, data) => api.put(`/api/applications/${id}`, data);

export const deleteApplication = (id) => api.delete(`/api/applications/${id}`);
