const express = require('express');
const router = express.Router();
const { getTeachers, createTeacher, getTeacherById } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getTeachers);
router.post('/', protect, authorize('admin'), createTeacher);
router.get('/:id', protect, getTeacherById);

module.exports = router;

