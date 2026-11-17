const Subject = require('../models/Subject');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ status: 'active' }).populate('classes', 'name numericGrade');
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private (Admin only)
const createSubject = async (req, res, next) => {
  try {
    const { name, code, type, classes } = req.body;

    const existing = await Subject.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Subject code already exists' });
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      type: type || 'theory',
      classes: classes || [],
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_SUBJECT',
      entity: 'Subject',
      entityId: subject._id,
      details: { name, code },
    });

    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  createSubject,
};

