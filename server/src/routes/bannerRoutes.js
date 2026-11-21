const express = require('express');
const router = express.Router();
const {
  getPublicBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/public', getPublicBanners);
router.get('/', protect, authorize('admin'), getAllBanners);
router.post('/', protect, authorize('admin'), createBanner);
router.put('/:id', protect, authorize('admin'), updateBanner);
router.delete('/:id', protect, authorize('admin'), deleteBanner);

module.exports = router;

