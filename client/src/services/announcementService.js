import axiosInstance from './axiosInstance';

// Communication & Notice Board Service (Module 11)
export const announcementService = {
  getAnnouncements: async () => {
    return await axiosInstance.get('/announcements');
  },

  createAnnouncement: async (announcementData) => {
    return await axiosInstance.post('/announcements', announcementData);
  },
};

export default announcementService;

