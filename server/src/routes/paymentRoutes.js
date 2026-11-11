const express = require('express');
const router = express.Router();
const { recordPayment, getPayments, getReceipt } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getPayments);
router.post('/', protect, authorize('admin'), recordPayment);
router.get('/receipt/:receiptNumber', protect, getReceipt);

module.exports = router;

