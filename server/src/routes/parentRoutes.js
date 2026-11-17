const express = require('express');
const router = express.Router();
const { getParents, createParent, getMyChildren } = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getParents);
router.post('/', protect, authorize('admin'), createParent);
router.get('/my-children', protect, authorize('parent'), getMyChildren);

module.exports = router;

