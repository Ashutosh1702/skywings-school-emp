import axiosInstance from './axiosInstance';

// Teacher & Staff Management Service (Module 5)
// Interacts with Express /api/teachers and MongoDB Teacher collection
export const teacherService = {
  // GET: Fetch teachers with search, department, and status filters
  getTeachers: async (params = {}) => {
    return await axiosInstance.get('/teachers', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  // GET: Fetch teacher by ID
  getTeacherById: async (id) => {
    return await axiosInstance.get(`/teachers/${id}`);
  },

  // POST: Register new teacher
  createTeacher: async (teacherData) => {
    return await axiosInstance.post('/teachers', teacherData);
  },

  // PUT: Update teacher profile
  updateTeacher: async (id, teacherData) => {
    return await axiosInstance.put(`/teachers/${id}`, teacherData);
  },

  // DELETE: Deactivate teacher
  deleteTeacher: async (id) => {
    return await axiosInstance.delete(`/teachers/${id}`);
  },
};

export default teacherService;

