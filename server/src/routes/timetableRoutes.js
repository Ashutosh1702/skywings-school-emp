const express = require('express');
const router = express.Router();
const {
  getTimetable,
  createTimetableSlot,
  deleteTimetableSlot,
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getTimetable);
router.post('/', protect, authorize('admin'), createTimetableSlot);
router.delete('/:id', protect, authorize('admin'), deleteTimetableSlot);

module.exports = router;

