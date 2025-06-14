// src/api/api.ts
import axios, { AxiosError } from "axios";
import type {
  AxiosInstance,
  // AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 1) Create an Axios instance with your Django DRF backend base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2) Helper to read/write tokens from localStorage (or sessionStorage)
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// 3) Request interceptor: attach access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4) Response interceptor: if we get a 401 (access expired), try to refresh
let isRefreshing = false;

// Each queued item holds the original config plus resolve/reject from a Promise
type FailedRequestQueueItem = {
  resolve: (value: AxiosResponse<any>) => void;
  reject: (err: any) => void;
  config: InternalAxiosRequestConfig;
};

let failedQueue: FailedRequestQueueItem[] = [];

function processQueue(error: any, token: string | null = null) {
  // For each queued request, retry or reject based on whether we have a token or error
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // If we have a new token, set it on the config before retrying
      if (token) {
        prom.config.headers = prom.config.headers || {};
        prom.config.headers.Authorization = `Bearer ${token}`;
      }
      // Retry the request; api(...) returns a Promise<AxiosResponse>
      api(prom.config)
        .then((resp) => prom.resolve(resp))
        .catch((err) => prom.reject(err));
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check for 401 and that we haven't already retried this request, and we have a refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getStoredRefreshToken()
    ) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      // Mark that we're retrying this request
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getStoredRefreshToken()!;
        // Adjust endpoint as needed; here using "/token/refresh/"
        const { data } = await api.post("/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = data.access;
        // Store new access token
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

        // Process the queued requests with the new token
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry the original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh also fails, reject all queued requests and clear tokens
        processQueue(refreshError, null);
        isRefreshing = false;
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    // If not a 401 or already retried, just forward the error
    return Promise.reject(error);
  }
);

export default api;
