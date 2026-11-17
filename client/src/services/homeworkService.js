import axiosInstance from './axiosInstance';

// Homework & Assignment Management Service (Module 10)
export const homeworkService = {
  getHomework: async (params = {}) => {
    return await axiosInstance.get('/homework', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  createHomework: async (homeworkData) => {
    return await axiosInstance.post('/homework', homeworkData);
  },
};

export default homeworkService;

