import axiosInstance from './axiosInstance';

// Timetable Management Service (Module 6)
export const timetableService = {
  getTimetable: async (params = {}) => {
    return await axiosInstance.get('/timetable', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  createSlot: async (slotData) => {
    return await axiosInstance.post('/timetable', slotData);
  },
};

export default timetableService;

