const express = require('express');
const router = express.Router();
const { getClasses, createClass, addSection } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getClasses);
router.post('/', protect, authorize('admin'), createClass);
router.post('/:id/sections', protect, authorize('admin'), addSection);

module.exports = router;

