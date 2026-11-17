const express = require('express');
const router = express.Router();
const {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  updateStudentStatus,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getStudents);
router.post('/', protect, authorize('admin'), createStudent);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, authorize('admin'), updateStudent);
router.patch('/:id/status', protect, authorize('admin'), updateStudentStatus);

module.exports = router;

