import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Uses env var in prod, proxy in dev
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    // Zustand allows us to read state outside of React components!
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors (like 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, log user out globally
      useAuthStore.getState().logout();
      // Optional: Redirect to login without using react-router here
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
