import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../Constants";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

// ✅ Clean single interceptor for all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // ✅ Only set Content-Type if it's NOT FormData and not already set
    const isFormData = config.data instanceof FormData;
    if (!isFormData && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Show logout message
      toast.error("Session expired. Please login again.");

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
    return Promise.reject(error);
  }
);

// ✅ Generic request handler

const ApiService = {
  request: async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: unknown,
    options?: {
      params?: Record<string, unknown>;
      headers?: Record<string, string>;
    }
  ) => {
    try {
      const response = await axiosInstance.request({
        method,
        url,
        data,
        params: options?.params,
        headers: options?.headers || {},
      });
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.data) {
        return error.response.data; // still resolve with backend payload
      }
      throw error; // for network errors, etc.
    }
  },
};

export default ApiService;
