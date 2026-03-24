/**
 * api.js
 * 
 * Centralized Axios instance for making API calls to the Spring Boot backend.
 * Includes request/response interceptors to easily attach auth tokens and handle global API errors.
 * Relies on vite server proxy (since baseURL is empty) to avoid CORS issues.
 */
import axios from 'axios';

// Axios instance - requests go through Vite proxy to Spring Boot
// Vite proxy forwards /auth/* → http://192.168.1.3:9091/auth/*
// This avoids CORS issues in the browser
const api = axios.create({
  baseURL: '', // Empty = uses Vite proxy (do NOT put direct IP here)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

api.interceptors.request.use(
  (config) => {
    // Add JWT token to headers if needed
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url} - Token sent: Yes (${token.substring(0, 10)}...)`);
    } else {
      console.warn(`[API Request] ${config.method.toUpperCase()} ${config.url} - Token sent: NO (User might be logged out)`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - runs after every response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
