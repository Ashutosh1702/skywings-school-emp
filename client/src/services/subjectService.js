import axiosInstance from './axiosInstance';

// Subject Management Service
export const subjectService = {
  getSubjects: async () => {
    return await axiosInstance.get('/subjects');
  },

  createSubject: async (subjectData) => {
    return await axiosInstance.post('/subjects', subjectData);
  },
};

export default subjectService;

