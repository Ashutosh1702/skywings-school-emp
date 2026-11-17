const express = require('express');
const router = express.Router();
const { getRoutes, createRoute, addStop } = require('../controllers/transportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/routes', protect, getRoutes);
router.post('/routes', protect, authorize('admin'), createRoute);
router.post('/routes/:id/stops', protect, authorize('admin'), addStop);

module.exports = router;

