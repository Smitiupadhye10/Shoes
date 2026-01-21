// frontend/src/api.js
import axios from "axios";

const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
  : "/api";

console.log("API Base URL:", baseURL);

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

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    // Don't log 403/401 errors for /auth/me - these are expected when user is not authenticated
    if ((status === 403 || status === 401) && url === '/auth/me') {
      // Silently handle authentication errors
      return Promise.reject(error);
    }
    
    // Log other errors
    console.error("API Error:", {
      message: error.message,
      url: url,
      baseURL: error.config?.baseURL,
      status: status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
