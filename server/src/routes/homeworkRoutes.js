const express = require('express');
const router = express.Router();
const { getHomework, createHomework } = require('../controllers/homeworkController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getHomework);
router.post('/', protect, authorize('admin', 'teacher'), createHomework);

module.exports = router;

