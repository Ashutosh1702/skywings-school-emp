const Parent = require('../models/Parent');
const User = require('../models/User');
const Student = require('../models/Student');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all parents
// @route   GET /api/parents
// @access  Private
const getParents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fatherName: { $regex: search, $options: 'i' } },
        { motherName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Parent.countDocuments(query);
    const parents = await Parent.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('children', 'firstName lastName admissionNumber rollNumber class section');

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: parents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new parent
// @route   POST /api/parents
// @access  Private (Admin only)
const createParent = async (req, res, next) => {
  try {
    const { fatherName, motherName, email, phone, occupation, address, password, children } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name: fatherName,
      email,
      password: password || 'Parent@123',
      role: 'parent',
    });

    const parent = await Parent.create({
      user: user._id,
      fatherName,
      motherName: motherName || '',
      email,
      phone,
      occupation: occupation || 'Professional',
      address: address || {},
      children: children || [],
    });

    // Link parent back to students
    if (children && children.length > 0) {
      await Student.updateMany({ _id: { $in: children } }, { parent: parent._id });
    }

    await logAction({
      userId: req.user._id,
      action: 'CREATE_PARENT',
      entity: 'Parent',
      entityId: parent._id,
      details: { fatherName, email, phone },
    });

    res.status(201).json({ success: true, data: parent });
  } catch (error) {
    next(error);
  }
};

// @desc    Get linked children for logged-in parent
// @route   GET /api/parents/my-children
// @access  Private (Parent only)
const getMyChildren = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ user: req.user._id }).populate({
      path: 'children',
      populate: [
        { path: 'class', select: 'name' },
        { path: 'section', select: 'name roomNumber' },
        { path: 'academicSession', select: 'name' },
      ],
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent record not found' });
    }

    res.status(200).json({ success: true, count: parent.children.length, data: parent.children });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParents,
  createParent,
  getMyChildren,
};

