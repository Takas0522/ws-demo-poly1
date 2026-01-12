import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

/**
 * API Client with interceptors for authentication and error handling
 *
 * Features:
 * - Automatic token injection
 * - Request/response interceptors
 * - Error handling
 * - Configurable base URL
 * - BFF pattern with Vite proxy routing
 */

// Get base URL from environment variable or use default
// In development, Vite proxy routes /api/* to backend services:
//   /api/auth/*    -> http://localhost:3001/api/auth/*
//   /api/users/*   -> http://localhost:3002/api/users/*
//   /api/settings/* -> http://localhost:3003/api/settings/*
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  // Note: withCredentials is not set globally for security
  // Set it per-request when needed for authenticated endpoints
});

/**
 * Request interceptor - Add authentication token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (or sessionStorage, cookies, etc.)
    const token = localStorage.getItem("authToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log("🚀 API Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle responses and errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(
        "✅ API Response:",
        response.config.method?.toUpperCase(),
        response.config.url,
        response.status
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && originalRequest) {
      // Clear token
      localStorage.removeItem("authToken");

      // Optionally redirect to login
      // window.location.href = '/login';

      console.error("🔒 Unauthorized - Please login again");
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error("⛔ Forbidden - Insufficient permissions");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("🔥 Server error - Please try again later");
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error("❌ API Error:", error.response?.status, error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to set authentication token
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

/**
 * Helper function to get authentication token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

/**
 * Helper function to clear authentication token
 */
export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
};

export default apiClient;
