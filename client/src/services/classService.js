import axiosInstance from './axiosInstance';

// Class and Section Management Service
export const classService = {
  getClasses: async () => {
    return await axiosInstance.get('/classes');
  },

  createClass: async (classData) => {
    return await axiosInstance.post('/classes', classData);
  },

  addSection: async (classId, sectionData) => {
    return await axiosInstance.post(`/classes/${classId}/sections`, sectionData);
  },
};

export default classService;

