import axios from 'axios';
import { getAuthToken } from '../context/auth';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://staff-records-backend-1b65.onrender.com/api', // 'https://staff-records-backend.onrender.com/api',   //'http://localhost:8000/api',
  // baseURL: process.env.REACT_APP_API_URL || 'https://staff-records-backend.onrender.com/api',
  // timeout: 100000,
  // Set timeout to 30 minutes for long processing tasks like large excel file processing
  timeout: process.env.REACT_APP_API_TIMEOUT ? Number(process.env.REACT_APP_API_TIMEOUT) : 1800000, // 30 * 60 * 1000 = 1,800,000 ms
});

// Request interceptor: attaches auth token and sets default headers
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log('\n\nRequest Token:', token);
    // Attach the token to the Authorization header if it exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Set default Content-Type header if not set
    // if (!config.headers['Content-Type']) {
    //   config.headers['Content-Type'] = 'application/json';
    // }
    // *** Add this block: if data is FormData, let the browser set the correct
  // multipart headers (with boundary). Otherwise default to JSON ***
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptors can be added here for auth tokens, logging, etc.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API error:', error);
    let message = 'An unexpected error occurred';

    if (error.response) {
      const data = error.response.data;
      // Prefer explicit server message fields
      if (data) {
        if (typeof data === 'string') {
          message = data;
        } else if (data.message) {
          message = data.message;
        } else if (data.error) {
          message = data.error;
        } else if (data.detail) {
          message = data.detail;
        } else if (Array.isArray(data.errors) && data.errors.length) {
          message = data.errors.join(', ');
        }
      }
      // Fallback based on status
      const status = error.response.status;
      if (!message) {
        if (status === 401) {
          message = 'Unauthorized access. Please log in again.';
        } else if (status >= 500) {
          message = 'Server error. Please try again later.';
        }
      }
    } else if (error.request) {
      // network error or no response
      message = 'Network error or request timed out.';
    }

    // Display toast and reject with clean Error
    toast.error(message);
    return Promise.reject(new Error(message));
  }
);

export default instance;
