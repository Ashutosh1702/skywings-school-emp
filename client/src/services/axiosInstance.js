import axios from 'axios';

// Create Central Axios Instance for SkyWings School ERP
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Authentication Token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skywings_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract response data and normalize errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Return backend payload directly { success: true, data: ... }
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      const message =
        error.response.data?.message ||
        `Backend API returned error code ${error.response.status}`;
      const err = new Error(message);
      err.status = error.response.status;
      err.data = error.response.data;
      return Promise.reject(err);
    } else if (error.request) {
      // Request was made but no response was received (Network Error / Port 5000 down)
      const err = new Error(
        'Backend server at ' +
          baseURL +
          ' is unreachable. Ensure the Express server is running on port 5000.'
      );
      err.isNetworkError = true;
      return Promise.reject(err);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

