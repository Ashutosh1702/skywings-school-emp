const express = require('express');
const router = express.Router();
const {
  getSchoolProfile,
  updateSchoolProfile,
  getAcademicSessions,
  createAcademicSession,
} = require('../controllers/schoolController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getSchoolProfile);
router.put('/', protect, authorize('admin'), updateSchoolProfile);
router.get('/sessions', protect, getAcademicSessions);
router.post('/sessions', protect, authorize('admin'), createAcademicSession);

module.exports = router;

