import axiosInstance from './axiosInstance';

// Examination & Result Management Service (Module 9)
// Interacts with Express /api/exams and MongoDB Exam & Mark collections
export const examService = {
  // GET: Fetch examinations list with filters
  getExams: async (params = {}) => {
    return await axiosInstance.get('/exams', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  // GET: Fetch single exam details by ID
  getExamById: async (id) => {
    return await axiosInstance.get(`/exams/${id}`);
  },

  // POST: Schedule new examination cycle
  createExam: async (examData) => {
    return await axiosInstance.post('/exams', examData);
  },

  // POST: Submit subject marks for exam
  submitMarks: async (examId, marksPayload) => {
    return await axiosInstance.post(`/exams/${examId}/marks`, marksPayload);
  },

  // GET: Fetch student report card with calculated grades and percentage
  getReportCard: async (examId, studentId) => {
    return await axiosInstance.get(`/exams/${examId}/student/${studentId}`);
  },
};

export default examService;

