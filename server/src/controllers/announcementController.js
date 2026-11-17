const Announcement = require('../models/Announcement');
const { logAction } = require('../utils/auditLogger');

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res, next) => {
  try {
    const role = req.user.role;
    const query = { status: 'published' };

    if (role !== 'admin') {
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
    const { title, message, targetAudience, targetClass, priority, expiryDate } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      targetAudience: targetAudience || ['all'],
      targetClass: targetClass || null,
      priority: priority || 'normal',
      expiryDate: expiryDate || null,
      author: req.user._id,
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_ANNOUNCEMENT',
      entity: 'Announcement',
      entityId: announcement._id,
      details: { title, priority, targetAudience },
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
};

