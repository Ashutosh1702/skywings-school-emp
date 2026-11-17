import axiosInstance from './axiosInstance';

// Reports & Analytics Service (Module 12)
export const reportService = {
  getStudentReport: async (params = {}) => {
    return await axiosInstance.get('/reports/students', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  getFeeReport: async (params = {}) => {
    return await axiosInstance.get('/reports/fees', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  getPendingFeeReport: async () => {
    return await axiosInstance.get('/reports/pending-fees');
  },
};

export default reportService;

