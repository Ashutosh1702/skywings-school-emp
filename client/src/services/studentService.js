import axiosInstance from './axiosInstance';

// Student Management Service (Module 3)
// Interacts with Express /api/students and MongoDB Student collection
export const studentService = {
  // GET: Fetch students with search, classId, sectionId, status, page, and limit
  getStudents: async (params = {}) => {
    return await axiosInstance.get('/students', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  // GET: Fetch student by ID
  getStudentById: async (id) => {
    return await axiosInstance.get(`/students/${id}`);
  },

  // POST: Admit new student
  createStudent: async (studentData) => {
    return await axiosInstance.post('/students', studentData);
  },

  // PUT: Update student record
  updateStudent: async (id, studentData) => {
    return await axiosInstance.put(`/students/${id}`, studentData);
  },

  // PATCH: Toggle active/inactive status
  toggleStudentStatus: async (id, status) => {
    return await axiosInstance.patch(`/students/${id}/status`, { status });
  },

  // DELETE: Deactivate student
  deleteStudent: async (id) => {
    return await axiosInstance.delete(`/students/${id}`);
  },
};

export default studentService;
