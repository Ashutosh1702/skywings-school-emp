const Class = require('../models/Class');
const Section = require('../models/Section');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all classes with sections
// @route   GET /api/classes
// @access  Private
const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ status: 'active' })
      .sort({ numericGrade: 1 })
      .populate({
        path: 'sections',
        populate: { path: 'classTeacher', select: 'name email phone employeeId' },
      });
    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a class
// @route   POST /api/classes
// @access  Private (Admin only)
const createClass = async (req, res, next) => {
  try {
    const { name, numericGrade } = req.body;

    const existing = await Class.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Class with this name already exists' });
    }

    const newClass = await Class.create({ name, numericGrade });

    // Automatically create a default Section 'A'
    const section = await Section.create({
      name: 'A',
      class: newClass._id,
      roomNumber: `Room ${numericGrade}01`,
    });

    newClass.sections.push(section._id);
    await newClass.save();

    await logAction({
      userId: req.user._id,
      action: 'CREATE_CLASS',
      entity: 'Class',
      entityId: newClass._id,
      details: { name, numericGrade },
    });

    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
};

// @desc    Add section to class
// @route   POST /api/classes/:id/sections
// @access  Private (Admin only)
const addSection = async (req, res, next) => {
  try {
    const { name, classTeacher, roomNumber, capacity } = req.body;
    const classId = req.params.id;

    const targetClass = await Class.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const existingSection = await Section.findOne({ class: classId, name: name.toUpperCase() });
    if (existingSection) {
      return res.status(400).json({ success: false, message: `Section ${name.toUpperCase()} already exists in this class` });
    }

    const section = await Section.create({
      name: name.toUpperCase(),
      class: classId,
      classTeacher: classTeacher || null,
      roomNumber: roomNumber || 'TBD',
      capacity: capacity || 40,
    });

    targetClass.sections.push(section._id);
    await targetClass.save();

    await logAction({
      userId: req.user._id,
      action: 'ADD_SECTION',
      entity: 'Section',
      entityId: section._id,
      details: { className: targetClass.name, section: name },
    });

    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClasses,
  createClass,
  addSection,
};

