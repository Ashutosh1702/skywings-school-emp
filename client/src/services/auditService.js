import axiosInstance from './axiosInstance';

// System Audit Trail Service (Module 14)
export const auditService = {
  getAuditLogs: async (params = {}) => {
    return await axiosInstance.get('/audit', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },
};

export default auditService;

