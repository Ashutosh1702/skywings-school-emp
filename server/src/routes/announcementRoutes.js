const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAnnouncements);
router.post('/', protect, authorize('admin'), createAnnouncement);

module.exports = router;

