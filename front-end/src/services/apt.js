import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Example: GET health check
export const getHealthStatus = async () => {
  const res = await api.get("/health");
  return res.data;
};

// Example: GET land degradation data
export const getLandData = async () => {
  const res = await api.get("/landdata");
  return res.data;
};

export default api;
