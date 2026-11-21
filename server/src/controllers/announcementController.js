const Announcement = require('../models/Announcement');
const { logAction } = require('../utils/auditLogger');

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Public / Private
const getAnnouncements = async (req, res, next) => {
  try {
    const role = req.user ? req.user.role : 'all';
    const query = {};

    if (role !== 'admin') {
      query.status = 'published';
      query.targetAudience = { $in: ['all', role] };
    }

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'name role')
      .populate('targetClass', 'name');

    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private (Admin only)
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, targetAudience, targetClass, priority, category, eventDate, location, expiryDate } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      targetAudience: targetAudience || ['all'],
      targetClass: targetClass || null,
      priority: priority || 'normal',
      category: category || 'notice',
      eventDate: eventDate || null,
      location: location || '',
      expiryDate: expiryDate || null,
      author: req.user ? req.user._id : '000000000000000000000001',
    });

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'CREATE_ANNOUNCEMENT',
        entity: 'Announcement',
        entityId: announcement._id,
        details: { title, priority, targetAudience },
      });
    }

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin only)
const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'UPDATE_ANNOUNCEMENT',
        entity: 'Announcement',
        entityId: announcement._id,
        details: req.body,
      });
    }

    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin only)
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'DELETE_ANNOUNCEMENT',
        entity: 'Announcement',
        entityId: announcement._id,
        details: { title: announcement.title },
      });
    }

    res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};

