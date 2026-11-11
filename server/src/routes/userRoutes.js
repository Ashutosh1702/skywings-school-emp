const express = require('express');
const router = express.Router();
const { getUsers, toggleUserStatus, resetUserPassword } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getUsers);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);
router.post('/:id/reset-password', protect, authorize('admin'), resetUserPassword);

module.exports = router;

