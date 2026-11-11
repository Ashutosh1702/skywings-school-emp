import axiosInstance from './axiosInstance';

// Transport Management Service (Module 16)
export const transportService = {
  getRoutes: async () => {
    return await axiosInstance.get('/transport/routes');
  },

  createRoute: async (routeData) => {
    return await axiosInstance.post('/transport/routes', routeData);
  },

  addStop: async (routeId, stopData) => {
    return await axiosInstance.post(`/transport/routes/${routeId}/stops`, stopData);
  },
};

export default transportService;

