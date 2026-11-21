const express = require('express');
const router = express.Router();
const {
  getTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getTeachers);
router.post('/', protect, authorize('admin'), createTeacher);
router.get('/:id', getTeacherById);
router.put('/:id', protect, authorize('admin'), updateTeacher);
router.delete('/:id', protect, authorize('admin'), deleteTeacher);

module.exports = router;

