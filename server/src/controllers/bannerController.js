const Banner = require('../models/Banner');
const { logAction } = require('../utils/auditLogger');

// @desc    Get active banners for public website
// @route   GET /api/banners/public
// @access  Public
const getPublicBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all banners for admin panel
// @route   GET /api/banners
// @access  Private (Admin only)
const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private (Admin only)
const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'CREATE_BANNER',
        entity: 'Banner',
        entityId: banner._id,
        details: { title: banner.title },
      });
    }

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private (Admin only)
const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'UPDATE_BANNER',
        entity: 'Banner',
        entityId: banner._id,
        details: req.body,
      });
    }

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private (Admin only)
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'DELETE_BANNER',
        entity: 'Banner',
        entityId: banner._id,
        details: { title: banner.title },
      });
    }

    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};

