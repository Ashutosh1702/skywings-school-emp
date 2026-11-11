import axiosInstance from './axiosInstance';

// Parent & Guardian Management Service (Module 4)
export const parentService = {
  getParents: async (params = {}) => {
    return await axiosInstance.get('/parents', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  getMyChildren: async () => {
    return await axiosInstance.get('/parents/my-children');
  },

  createParent: async (parentData) => {
    return await axiosInstance.post('/parents', parentData);
  },
};

export default parentService;

