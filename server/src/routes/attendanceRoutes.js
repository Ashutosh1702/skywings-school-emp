const express = require('express');
const router = express.Router();
const {
  getClassAttendance,
  saveBulkAttendance,
  getStudentAttendance,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getClassAttendance);
router.post('/bulk', protect, authorize('admin', 'teacher'), saveBulkAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);

module.exports = router;

