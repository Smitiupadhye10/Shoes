// frontend/src/api.js
import axios from "axios";

const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
  : "/api";

const api = axios.create({
  baseURL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default api;
