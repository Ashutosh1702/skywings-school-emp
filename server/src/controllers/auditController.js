const AuditLog = require('../models/AuditLog');

// @desc    Get system audit logs
// @route   GET /api/audit
// @access  Private (Admin only)
const getAuditLogs = async (req, res, next) => {
  try {
    const { action, entity, page = 1, limit = 20 } = req.query;
    const query = {};

    if (action) query.action = action;
    if (entity) query.entity = entity;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email role');

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLogs };

