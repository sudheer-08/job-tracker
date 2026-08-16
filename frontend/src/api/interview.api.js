import api from "./axios";

export const generateInterview = async (data) => {
  const response = await api.post("/api/interview/generate", data);
  return response.data;
};

export const getInterviewSession = async (sessionId) => {
  const response = await api.get(`/api/interview/session/${sessionId}`);
  return response.data;
};

export const submitInterviewAnswer = async (questionId, answer) => {
  const response = await api.post("/api/interview/answer", { questionId, answer });
  return response.data;
};

export const getInterviewAnalytics = async () => {
  const response = await api.get("/api/interview/analytics");
  return response.data;
};
