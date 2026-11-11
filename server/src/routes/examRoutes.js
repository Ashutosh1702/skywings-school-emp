const express = require('express');
const router = express.Router();
const {
  getExams,
  createExam,
  submitMarks,
  getStudentReportCard,
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getExams);
router.post('/', protect, authorize('admin'), createExam);
router.post('/:examId/marks', protect, authorize('admin', 'teacher'), submitMarks);
router.get('/:examId/student/:studentId', protect, getStudentReportCard);

module.exports = router;

