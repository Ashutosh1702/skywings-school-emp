const express = require('express');
const router = express.Router();
const {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getStudents);
router.post('/', protect, authorize('admin'), createStudent);
router.get('/:id', getStudentById);
router.put('/:id', protect, authorize('admin'), updateStudent);
router.patch('/:id/status', protect, authorize('admin'), updateStudentStatus);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;

