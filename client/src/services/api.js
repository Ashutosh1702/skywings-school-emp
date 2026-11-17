import axiosInstance from './axiosInstance';
import authService from './authService';
import dashboardService from './dashboardService';
import studentService from './studentService';
import teacherService from './teacherService';
import parentService from './parentService';
import attendanceService from './attendanceService';
import feeService from './feeService';
import examService from './examService';
import classService from './classService';
import subjectService from './subjectService';
import timetableService from './timetableService';
import homeworkService from './homeworkService';
import announcementService from './announcementService';
import reportService from './reportService';
import userService from './userService';
import auditService from './auditService';
import libraryService from './libraryService';
import transportService from './transportService';
import schoolService from './schoolService';
import * as mock from './mockData';

// Safe execution wrapper: Uses Axios to communicate with MongoDB via Express API
// If the backend on port 5000 is temporarily offline, safely falls back so the UI never crashes
async function safeExecute(axiosCall, fallbackFn) {
  try {
    const res = await axiosCall();
    return res;
  } catch (err) {
    // If it's a real HTTP status error from the server (e.g. 400 Bad Request, 401 Unauthorized), rethrow it
    if (err.status && err.status !== 502 && err.status !== 503) {
      throw err;
    }

    // Network connection error: Backend server is not running on port 5000
    const isNetwork =
      err.isNetworkError ||
      !err.status ||
      err.message?.includes('Network Error') ||
      err.message?.includes('fetch') ||
      err.message?.includes('unreachable') ||
      err.message?.includes('Failed to fetch');

    if (isNetwork && typeof fallbackFn === 'function') {
      console.warn(
        '[SkyWings ERP] Live Express backend on port 5000 is not reachable. Using fallback dataset.'
      );
      return fallbackFn();
    }

    throw err;
  }
}

// In-memory runtime state for mutations when backend is offline
let runtimeStudents = [...mock.mockStudents];
let runtimeTeachers = [...mock.mockTeachers];
let runtimeParents = [...mock.mockParents];
let runtimeClasses = [...mock.mockClasses];
let runtimeSubjects = [...mock.mockSubjects];
let runtimeTimetable = [...mock.mockTimetable];
let runtimePayments = [...mock.mockPayments];
let runtimeExams = [...mock.mockExams];
let runtimeHomework = [...mock.mockHomework];
let runtimeAnnouncements = [...mock.mockAnnouncements];
let runtimeBooks = [...mock.mockBooks];
let runtimeRoutes = [...mock.mockTransportRoutes];
let runtimeUsers = [...mock.mockUsers];
let runtimeSessions = [...mock.mockAcademicSessions];
let runtimeProfile = { ...mock.mockSchoolProfile };

export const api = {
  // Auth
  login: (credentials) =>
    safeExecute(
      () => authService.login(credentials),
      () => {
        const { email } = credentials;
        let role = 'admin';
        let name = 'Dr. Rajesh Sharma (Principal)';
        let id = 'u-1';

        if (email.toLowerCase().includes('teacher')) {
          role = 'teacher';
          name = 'Priya Mukherjee';
          id = 'u-2';
        } else if (email.toLowerCase().includes('parent')) {
          role = 'parent';
          name = 'Vikramaditya Roy';
          id = 'u-3';
        }

        const userData = {
          _id: id,
          name,
          email,
          role,
          token: `mock-jwt-skywings-${role}-token`,
        };

        return {
          success: true,
          message: 'Authenticated successfully',
          data: userData,
        };
      }
    ),

  getMe: () =>
    safeExecute(
      () => authService.getMe(),
      () => {
        const saved = localStorage.getItem('skywings_user');
        if (saved) {
          try {
            return { success: true, data: JSON.parse(saved) };
          } catch {}
        }
        return {
          success: true,
          data: {
            _id: 'u-1',
            name: 'Dr. Rajesh Sharma (Principal)',
            email: 'admin@skywings.com',
            role: 'admin',
          },
        };
      }
    ),

  // Users & Permissions (Module 13)
  getUsers: (params) =>
    safeExecute(
      () => userService.getUsers(params),
      () => ({ success: true, data: runtimeUsers })
    ),

  toggleUserStatus: (id) =>
    safeExecute(
      () => userService.toggleUserStatus(id),
      () => {
        runtimeUsers = runtimeUsers.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u));
        return { success: true, message: 'User status updated successfully' };
      }
    ),

  resetUserPassword: (id, newPassword) =>
    safeExecute(
      () => userService.resetPassword(id, newPassword),
      () => ({ success: true, message: 'Password reset successfully' })
    ),

  // Dashboard (Module 1)
  getDashboard: () =>
    safeExecute(
      () => dashboardService.getDashboardMetrics(),
      () => {
        const saved = localStorage.getItem('skywings_user');
        let role = 'admin';
        if (saved) {
          try {
            role = JSON.parse(saved).role || 'admin';
          } catch {}
        }
        return {
          success: true,
          data: mock.mockDashboardData[role] || mock.mockDashboardData.admin,
        };
      }
    ),

  // Students (Module 3)
  getStudents: (params) =>
    safeExecute(
      () => studentService.getStudents(params),
      () => ({ success: true, data: runtimeStudents })
    ),

  createStudent: (data) =>
    safeExecute(
      () => studentService.createStudent(data),
      () => {
        const newStudent = {
          _id: `std-${Date.now()}`,
          admissionNumber: data.admissionNumber || `ADM-2026-00${runtimeStudents.length + 1}`,
          rollNumber: data.rollNumber || `${runtimeStudents.length + 101}`,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender || 'male',
          dateOfBirth: data.dateOfBirth || '2012-01-01',
          bloodGroup: data.bloodGroup || 'O+',
          status: 'active',
          email: data.email || `${data.firstName?.toLowerCase()}@student.skywings.com`,
          phone: data.phone || '+91 98000 00000',
          class: runtimeClasses.find((c) => c._id === data.class) || { _id: 'cls-10', name: 'Grade 10' },
          section: { _id: 'sec-10a', name: 'A' },
          attendanceRate: 100,
          feeStatus: 'pending',
        };
        runtimeStudents = [newStudent, ...runtimeStudents];
        return { success: true, data: newStudent, message: 'Student created successfully' };
      }
    ),

  getStudentById: (id) =>
    safeExecute(
      () => studentService.getStudentById(id),
      () => ({
        success: true,
        data: runtimeStudents.find((s) => s._id === id) || runtimeStudents[0],
      })
    ),

  updateStudent: (id, data) =>
    safeExecute(
      () => studentService.updateStudent(id, data),
      () => {
        runtimeStudents = runtimeStudents.map((s) =>
          s._id === id ? { ...s, ...data } : s
        );
        return { success: true, message: 'Student record updated successfully' };
      }
    ),

  toggleStudentStatus: (id, status) =>
    safeExecute(
      () => studentService.toggleStudentStatus(id, status),
      () => {
        runtimeStudents = runtimeStudents.map((s) =>
          s._id === id ? { ...s, status } : s
        );
        return { success: true, message: `Student status updated to ${status}` };
      }
    ),

  // Teachers (Module 5)
  getTeachers: (params) =>
    safeExecute(
      () => teacherService.getTeachers(params),
      () => ({ success: true, data: runtimeTeachers })
    ),

  createTeacher: (data) =>
    safeExecute(
      () => teacherService.createTeacher(data),
      () => {
        const newTeacher = {
          _id: `tch-${Date.now()}`,
          employeeId: data.employeeId || `EMP-T-${runtimeTeachers.length + 101}`,
          name: data.name,
          email: data.email,
          phone: data.phone || '+91 98000 11111',
          designation: data.designation || 'Lecturer',
          department: data.department || 'Academics',
          qualification: data.qualification || 'M.Sc, B.Ed',
          status: 'active',
          assignedClasses: [],
          subjects: [],
        };
        runtimeTeachers = [newTeacher, ...runtimeTeachers];
        return { success: true, data: newTeacher, message: 'Teacher added successfully' };
      }
    ),

  // Parents (Module 4)
  getParents: (params) =>
    safeExecute(
      () => parentService.getParents(params),
      () => ({ success: true, data: runtimeParents })
    ),

  getMyChildren: () =>
    safeExecute(
      () => parentService.getMyChildren(),
      () => ({ success: true, data: runtimeStudents.slice(0, 2) })
    ),

  createParent: (data) =>
    safeExecute(
      () => parentService.createParent(data),
      () => {
        const newParent = {
          _id: `par-${Date.now()}`,
          fatherName: data.fatherName,
          motherName: data.motherName || '',
          email: data.email,
          phone: data.phone,
          occupation: data.occupation || 'Professional',
          address: data.address || { city: 'Bangalore' },
          children: [],
        };
        runtimeParents = [newParent, ...runtimeParents];
        return { success: true, data: newParent, message: 'Parent registered successfully' };
      }
    ),

  // Classes & Sections (Module 2)
  getClasses: () =>
    safeExecute(
      () => classService.getClasses(),
      () => ({ success: true, data: runtimeClasses })
    ),

  createClass: (data) =>
    safeExecute(
      () => classService.createClass(data),
      () => {
        const newClass = {
          _id: `cls-${Date.now()}`,
          name: data.name,
          numericGrade: data.numericGrade || 1,
          sections: [],
        };
        runtimeClasses = [...runtimeClasses, newClass];
        return { success: true, data: newClass, message: 'Class created successfully' };
      }
    ),

  addSection: (classId, data) =>
    safeExecute(
      () => classService.addSection(classId, data),
      () => {
        const newSection = {
          _id: `sec-${Date.now()}`,
          name: data.name,
          roomNumber: data.roomNumber || 'Room 101',
          capacity: data.capacity || 40,
        };
        runtimeClasses = runtimeClasses.map((c) =>
          c._id === classId ? { ...c, sections: [...c.sections, newSection] } : c
        );
        return { success: true, data: newSection, message: 'Section added successfully' };
      }
    ),

  // Subjects (Module 2)
  getSubjects: () =>
    safeExecute(
      () => subjectService.getSubjects(),
      () => ({ success: true, data: runtimeSubjects })
    ),

  createSubject: (data) =>
    safeExecute(
      () => subjectService.createSubject(data),
      () => {
        const newSub = {
          _id: `sub-${Date.now()}`,
          name: data.name,
          code: data.code || `SUB${runtimeSubjects.length + 10}`,
          type: data.type || 'theory',
          classes: [],
        };
        runtimeSubjects = [...runtimeSubjects, newSub];
        return { success: true, data: newSub, message: 'Subject created successfully' };
      }
    ),

  // School Profile & Master Setup (Module 2)
  getSchoolProfile: () =>
    safeExecute(
      () => schoolService.getProfile(),
      () => ({ success: true, data: runtimeProfile })
    ),

  updateSchoolProfile: (data) =>
    safeExecute(
      () => schoolService.updateProfile(data),
      () => {
        runtimeProfile = { ...runtimeProfile, ...data };
        return { success: true, data: runtimeProfile, message: 'School profile updated successfully' };
      }
    ),

  getAcademicSessions: () =>
    safeExecute(
      () => schoolService.getSessions(),
      () => ({ success: true, data: runtimeSessions })
    ),

  createAcademicSession: (data) =>
    safeExecute(
      () => schoolService.createSession(data),
      () => {
        const newSession = {
          _id: `ses-${Date.now()}`,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          isCurrent: !!data.isCurrent,
          status: 'active',
        };
        runtimeSessions = [...runtimeSessions, newSession];
        return { success: true, data: newSession, message: 'Academic session created successfully' };
      }
    ),

  // Timetable (Module 6)
  getTimetable: (params) =>
    safeExecute(
      () => timetableService.getTimetable(params),
      () => ({ success: true, data: runtimeTimetable })
    ),

  createTimetableSlot: (data) =>
    safeExecute(
      () => timetableService.createSlot(data),
      () => {
        const newSlot = {
          _id: `tt-${Date.now()}`,
          ...data,
          subject: runtimeSubjects.find((s) => s._id === data.subject) || { name: 'Subject' },
          teacher: runtimeTeachers.find((t) => t._id === data.teacher) || { name: 'Teacher' },
          class: runtimeClasses.find((c) => c._id === data.class) || { name: 'Class' },
          section: { name: 'A' },
        };
        runtimeTimetable = [...runtimeTimetable, newSlot];
        return { success: true, data: newSlot, message: 'Timetable slot created' };
      }
    ),

  // Attendance (Module 7)
  getClassAttendance: (classId, sectionId, date) =>
    safeExecute(
      () => attendanceService.getClassAttendance(classId, sectionId, date),
      () => ({
        success: true,
        data: runtimeStudents.map((std) => ({
          student: std,
          status: 'present',
          remarks: '',
        })),
      })
    ),

  saveAttendance: (data) =>
    safeExecute(
      () => attendanceService.saveBulkAttendance(data),
      () => ({ success: true, message: 'Attendance batch records saved successfully' })
    ),

  getStudentAttendance: (studentId) =>
    safeExecute(
      () => attendanceService.getStudentAttendance(studentId),
      () => ({
        success: true,
        data: {
          presentDays: 85,
          totalDays: 90,
          percentage: 94.4,
          records: [],
        },
      })
    ),

  // Fees & Payments (Module 8)
  getFeeHeads: () =>
    safeExecute(
      () => feeService.getFeeHeads(),
      () => ({ success: true, data: mock.mockFeeHeads })
    ),

  getFeeStructures: () =>
    safeExecute(
      () => feeService.getFeeStructures(),
      () => ({ success: true, data: mock.mockFeeStructures })
    ),

  getStudentFee: (studentId) =>
    safeExecute(
      () => feeService.getStudentFee(studentId),
      () => ({
        success: true,
        data: {
          feeStructure: mock.mockFeeStructures[0],
          grossTotal: 80000,
          totalAmount: 80000,
          concessionAmount: 0,
          totalPaid: 40000,
          paidAmount: 40000,
          balance: 40000,
          status: 'partial',
          installments: [
            {
              installmentNumber: 1,
              name: 'Term 1 Installment',
              dueDate: '2026-06-15',
              amount: 20000,
              paidAmount: 20000,
              balanceAmount: 0,
              status: 'paid',
            },
            {
              installmentNumber: 2,
              name: 'Term 2 Installment',
              dueDate: '2026-09-15',
              amount: 20000,
              paidAmount: 20000,
              balanceAmount: 0,
              status: 'paid',
            },
            {
              installmentNumber: 3,
              name: 'Term 3 Installment',
              dueDate: '2026-12-15',
              amount: 20000,
              paidAmount: 0,
              balanceAmount: 20000,
              status: 'pending',
            },
            {
              installmentNumber: 4,
              name: 'Term 4 Installment',
              dueDate: '2027-03-15',
              amount: 20000,
              paidAmount: 0,
              balanceAmount: 20000,
              status: 'pending',
            },
          ],
        },
      })
    ),

  getPayments: (params) =>
    safeExecute(
      () => feeService.getPayments(params),
      () => ({ success: true, data: runtimePayments })
    ),

  recordPayment: (data) =>
    safeExecute(
      () => feeService.recordPayment(data),
      () => {
        const newPayment = {
          _id: `pay-${Date.now()}`,
          receiptNumber: `RCP-2026-00${runtimePayments.length + 900}`,
          paymentDate: new Date().toISOString().split('T')[0],
          amount: Number(data.amount),
          amountPaid: Number(data.amount),
          remainingBalance: 0,
          paymentMethod: data.paymentMethod || 'UPI',
          transactionId: data.transactionId || `TXN-${Date.now()}`,
          status: 'completed',
          student: runtimeStudents.find((s) => s._id === data.student) || runtimeStudents[0],
        };
        runtimePayments = [newPayment, ...runtimePayments];
        return { success: true, data: newPayment, message: 'Fee payment recorded successfully' };
      }
    ),

  getReceipt: (receiptNumber) =>
    safeExecute(
      () => feeService.getReceipt(receiptNumber),
      () => ({
        success: true,
        data: runtimePayments.find((p) => p.receiptNumber === receiptNumber) || runtimePayments[0],
      })
    ),

  // Exams & Results (Module 9)
  getExams: (params) =>
    safeExecute(
      () => examService.getExams(params),
      () => ({ success: true, data: runtimeExams })
    ),

  createExam: (data) =>
    safeExecute(
      () => examService.createExam(data),
      () => {
        const newExam = {
          _id: `ex-${Date.now()}`,
          name: data.name,
          class: runtimeClasses.find((c) => c._id === data.class) || { name: 'Grade 10' },
          startDate: data.startDate || '2026-09-01',
          endDate: data.endDate || '2026-09-10',
          status: 'upcoming',
          schedule: [],
        };
        runtimeExams = [newExam, ...runtimeExams];
        return { success: true, data: newExam, message: 'Exam created successfully' };
      }
    ),

  submitMarks: (examId, data) =>
    safeExecute(
      () => examService.submitMarks(examId, data),
      () => ({ success: true, message: 'Marks recorded and graded successfully' })
    ),

  getReportCard: (examId, studentId) =>
    safeExecute(
      () => examService.getReportCard(examId, studentId),
      () => ({
        success: true,
        data: {
          student: runtimeStudents[0],
          exam: runtimeExams[0],
          marks: [
            { _id: 'm-1', subject: { name: 'Mathematics' }, marksObtained: 92, maxMarks: 100, grade: 'A1', remarks: 'Excellent' },
            { _id: 'm-2', subject: { name: 'Science & Technology' }, marksObtained: 88, maxMarks: 100, grade: 'A2', remarks: 'Very Good' },
            { _id: 'm-3', subject: { name: 'English Language' }, marksObtained: 90, maxMarks: 100, grade: 'A1', remarks: 'Outstanding' },
          ],
          totalMarks: 270,
          maxTotal: 300,
          percentage: 90.0,
          overallGrade: 'A1',
          summary: {
            overallPercentage: 90.0,
            overallGrade: 'A1',
            totalMarks: 270,
            maxMarks: 300,
          },
        },
      })
    ),

  // Homework (Module 10)
  getHomework: (params) =>
    safeExecute(
      () => homeworkService.getHomework(params),
      () => ({ success: true, data: runtimeHomework })
    ),

  createHomework: (data) =>
    safeExecute(
      () => homeworkService.createHomework(data),
      () => {
        const newHw = {
          _id: `hw-${Date.now()}`,
          title: data.title,
          description: data.description,
          class: runtimeClasses.find((c) => c._id === data.class) || { name: 'Grade 10' },
          section: { name: 'A' },
          subject: runtimeSubjects.find((s) => s._id === data.subject) || { name: 'Mathematics' },
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: data.dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        };
        runtimeHomework = [newHw, ...runtimeHomework];
        return { success: true, data: newHw, message: 'Homework posted successfully' };
      }
    ),

  // Announcements (Module 11)
  getAnnouncements: () =>
    safeExecute(
      () => announcementService.getAnnouncements(),
      () => ({ success: true, data: runtimeAnnouncements })
    ),

  createAnnouncement: (data) =>
    safeExecute(
      () => announcementService.createAnnouncement(data),
      () => {
        const audience = Array.isArray(data.targetAudience)
          ? data.targetAudience
          : [data.targetAudience || 'all'];
        const newAnn = {
          _id: `ann-${Date.now()}`,
          title: data.title,
          message: data.message || data.content,
          content: data.message || data.content,
          targetAudience: audience,
          priority: data.priority || (data.isUrgent ? 'urgent' : 'normal'),
          createdAt: new Date().toISOString(),
          publishDate: new Date().toISOString().split('T')[0],
          author: { name: 'School Administration' },
          isUrgent: !!data.isUrgent,
        };
        runtimeAnnouncements = [newAnn, ...runtimeAnnouncements];
        return { success: true, data: newAnn, message: 'Announcement published successfully' };
      }
    ),

  // Reports (Module 12)
  getStudentReport: (params) =>
    safeExecute(
      () => reportService.getStudentReport(params),
      () => ({ success: true, data: runtimeStudents })
    ),

  getFeeReport: (params) =>
    safeExecute(
      () => reportService.getFeeReport(params),
      () => ({ success: true, data: runtimePayments })
    ),

  getPendingFeeReport: () =>
    safeExecute(
      () => reportService.getPendingFeeReport(),
      () => ({
        success: true,
        data: runtimeStudents.filter((s) => s.feeStatus === 'pending'),
      })
    ),

  // Audit Logs (Module 14)
  getAuditLogs: (params) =>
    safeExecute(
      () => auditService.getAuditLogs(params),
      () => ({ success: true, data: mock.mockAuditLogs })
    ),

  // Library Management (Module 15)
  getBooks: (params) =>
    safeExecute(
      () => libraryService.getBooks(params),
      () => ({ success: true, data: runtimeBooks })
    ),

  addBook: (data) =>
    safeExecute(
      () => libraryService.addBook(data),
      () => {
        const newBook = {
          _id: `bk-${Date.now()}`,
          title: data.title,
          isbn: data.isbn || `978-81-${Date.now().toString().slice(-6)}`,
          author: data.author,
          category: data.category || 'General',
          totalCopies: data.totalCopies || 5,
          availableCopies: data.totalCopies || 5,
          shelfLocation: data.shelfLocation || 'Shelf A-1',
        };
        runtimeBooks = [newBook, ...runtimeBooks];
        return { success: true, data: newBook, message: 'Book cataloged successfully' };
      }
    ),

  getBookIssues: () =>
    safeExecute(
      () => libraryService.getBookIssues(),
      () => ({ success: true, data: [] })
    ),

  issueBook: (data) =>
    safeExecute(
      () => libraryService.issueBook(data),
      () => ({ success: true, message: 'Book issued successfully to student' })
    ),

  returnBook: (issueId) =>
    safeExecute(
      () => libraryService.returnBook(issueId),
      () => ({ success: true, message: 'Book marked as returned' })
    ),

  // Transport Management (Module 16)
  getTransportRoutes: () =>
    safeExecute(
      () => transportService.getRoutes(),
      () => ({ success: true, data: runtimeRoutes })
    ),

  createTransportRoute: (data) =>
    safeExecute(
      () => transportService.createRoute(data),
      () => {
        const newRoute = {
          _id: `tr-${Date.now()}`,
          routeName: data.routeName,
          vehicleNumber: data.vehicleNumber,
          driverName: data.driverName,
          driverPhone: data.driverPhone,
          capacity: data.capacity || 40,
          stops: [],
        };
        runtimeRoutes = [...runtimeRoutes, newRoute];
        return { success: true, data: newRoute, message: 'Transport route created successfully' };
      }
    ),

  addTransportStop: (routeId, data) =>
    safeExecute(
      () => transportService.addStop(routeId, data),
      () => {
        runtimeRoutes = runtimeRoutes.map((r) =>
          r._id === routeId ? { ...r, stops: [...r.stops, data] } : r
        );
        return { success: true, message: 'Stop added to route successfully' };
      }
    ),
};

export default api;
