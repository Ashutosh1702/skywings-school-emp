import axiosInstance from './axiosInstance';

// Attendance Management Service (Module 7)
// Interacts with Express /api/attendance and MongoDB Attendance collection
export const attendanceService = {
  // GET: Fetch class attendance roster for specified date
  getClassAttendance: async (classId, sectionId, date) => {
    return await axiosInstance.get('/attendance', {
      params: { classId, sectionId, date },
    });
  },

  // POST: Batch save daily attendance records
  saveBulkAttendance: async (attendancePayload) => {
    return await axiosInstance.post('/attendance/bulk', attendancePayload);
  },

  // GET: Fetch student-specific historical attendance summary
  getStudentAttendance: async (studentId) => {
    return await axiosInstance.get(`/attendance/student/${studentId}`);
  },
};

export default attendanceService;

