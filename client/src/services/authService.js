import axiosInstance from './axiosInstance';

// Authentication & Session Service
export const authService = {
  login: async (credentials) => {
    return await axiosInstance.post('/auth/login', credentials);
  },

  getMe: async () => {
    return await axiosInstance.get('/auth/me');
  },
};

export default authService;

