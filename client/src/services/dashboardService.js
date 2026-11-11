import axiosInstance from './axiosInstance';

// Role-Specific Dashboard Metrics Service (Module 1)
// Interacts with Express /api/dashboard and computes real MongoDB metrics
export const dashboardService = {
  // GET: Fetch role-tailored real-time statistics, KPIs, and charts
  getDashboardMetrics: async () => {
    return await axiosInstance.get('/dashboard');
  },
};

export default dashboardService;

