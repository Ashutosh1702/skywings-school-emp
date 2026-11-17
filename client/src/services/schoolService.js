import axiosInstance from './axiosInstance';

// School Institutional Settings & Master Data Service (Module 2)
export const schoolService = {
  getProfile: async () => {
    return await axiosInstance.get('/school');
  },

  updateProfile: async (profileData) => {
    return await axiosInstance.put('/school', profileData);
  },

  getSessions: async () => {
    return await axiosInstance.get('/school/sessions');
  },

  createSession: async (sessionData) => {
    return await axiosInstance.post('/school/sessions', sessionData);
  },
};

export default schoolService;

