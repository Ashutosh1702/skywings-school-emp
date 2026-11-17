const express = require('express');
const router = express.Router();
const {
  getFeeHeads,
  createFeeHead,
  getFeeStructures,
  createFeeStructure,
  getStudentFee,
  applyConcession,
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/heads', protect, getFeeHeads);
router.post('/heads', protect, authorize('admin'), createFeeHead);
router.get('/structures', protect, getFeeStructures);
router.post('/structures', protect, authorize('admin'), createFeeStructure);
router.get('/student/:studentId', protect, getStudentFee);
router.post('/student/:studentId/concession', protect, authorize('admin'), applyConcession);

module.exports = router;

