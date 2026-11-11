const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all teachers with search and filter
// @route   GET /api/teachers
// @access  Private
const getTeachers = async (req, res, next) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Teacher.countDocuments(query);
    const teachers = await Teacher.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('subjects', 'name code')
      .populate('assignedClasses.class', 'name')
      .populate('assignedClasses.section', 'name');

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new teacher
// @route   POST /api/teachers
// @access  Private (Admin only)
const createTeacher = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      employeeId,
      designation,
      department,
      qualification,
      subjects,
      assignedClasses,
      password,
    } = req.body;

    // Check if user or teacher already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const existingEmp = await Teacher.findOne({ employeeId });
    if (existingEmp) {
      return res.status(400).json({ success: false, message: 'Employee ID already in use' });
    }

    // Create user login account
    const user = await User.create({
      name,
      email,
      password: password || 'Teacher@123',
      role: 'teacher',
    });

    const teacher = await Teacher.create({
      user: user._id,
      employeeId,
      name,
      email,
      phone,
      designation: designation || 'Teacher',
      department: department || 'General',
      qualification: qualification || 'B.Ed',
      subjects: subjects || [],
      assignedClasses: assignedClasses || [],
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_TEACHER',
      entity: 'Teacher',
      entityId: teacher._id,
      details: { name, employeeId, email },
    });

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher profile
// @route   GET /api/teachers/:id
// @access  Private
const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('subjects', 'name code')
      .populate('assignedClasses.class', 'name')
      .populate('assignedClasses.section', 'name');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeachers,
  createTeacher,
  getTeacherById,
};

