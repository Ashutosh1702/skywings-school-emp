import axiosInstance from './axiosInstance';

// Users & Roles Management Service (Module 13)
export const userService = {
  getUsers: async (params = {}) => {
    return await axiosInstance.get('/users', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  toggleUserStatus: async (id) => {
    return await axiosInstance.patch(`/users/${id}/toggle-status`);
  },

  resetPassword: async (id, newPassword) => {
    return await axiosInstance.post(`/users/${id}/reset-password`, { newPassword });
  },
};

export default userService;

