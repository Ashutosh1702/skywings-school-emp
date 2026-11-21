const Gallery = require('../models/Gallery');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all gallery items (supports ?category=Sports&featured=true)
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a gallery item
// @route   POST /api/gallery
// @access  Private (Admin only)
const createGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.create(req.body);

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'CREATE_GALLERY_ITEM',
        entity: 'Gallery',
        entityId: item._id,
        details: { title: item.title, category: item.category },
      });
    }

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a gallery item
// @route   PUT /api/gallery/:id
// @access  Private (Admin only)
const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'UPDATE_GALLERY_ITEM',
        entity: 'Gallery',
        entityId: item._id,
        details: req.body,
      });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (Admin only)
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'DELETE_GALLERY_ITEM',
        entity: 'Gallery',
        entityId: item._id,
        details: { title: item.title },
      });
    }

    res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};

