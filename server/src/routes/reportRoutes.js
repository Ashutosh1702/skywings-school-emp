const express = require('express');
const router = express.Router();
const {
  getStudentReport,
  getFeeReport,
  getPendingFeeReport,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/students', protect, authorize('admin'), getStudentReport);
router.get('/fees', protect, authorize('admin'), getFeeReport);
router.get('/pending-fees', protect, authorize('admin'), getPendingFeeReport);

module.exports = router;

