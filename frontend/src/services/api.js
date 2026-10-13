import axios from 'axios';
import { getStoredToken } from './storage';

// Base URL loaded from environment variable, default to live Render backend in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:8080' : 'https://careconnect-backend-g73n.onrender.com');
const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer Token to outgoing Spring Boot requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Intercept standard HTTP response or gracefully handle backend status
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized request to Spring Boot backend.');
    }
    return Promise.reject(error);
  }
);

export { apiClient, API_BASE_URL, ENABLE_MOCK_FALLBACK };
export default apiClient;
