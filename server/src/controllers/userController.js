const User = require('../models/User');
const { logAction } = require('../utils/auditLogger');
const bcrypt = require('bcryptjs');

// @desc    Get all users with search, role and status filter
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'all') query.role = role;
    if (status !== undefined && status !== 'all') query.isActive = status === 'active';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user account activation/deactivation
// @route   PATCH /api/users/:id/toggle-status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivating own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await logAction({
      userId: req.user._id,
      action: user.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      entity: 'User',
      entityId: user._id,
      details: { email: user.email, newStatus: user.isActive },
    });

    res.status(200).json({
      success: true,
      message: `Account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin reset user password
// @route   POST /api/users/:id/reset-password
// @access  Private (Admin only)
const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    await logAction({
      userId: req.user._id,
      action: 'RESET_PASSWORD',
      entity: 'User',
      entityId: user._id,
      details: { email: user.email },
    });

    res.status(200).json({ success: true, message: 'User password successfully updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  toggleUserStatus,
  resetUserPassword,
};

