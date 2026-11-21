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

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin only)
const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('classes', 'name numericGrade');

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'UPDATE_SUBJECT',
        entity: 'Subject',
        entityId: subject._id,
        details: req.body,
      });
    }

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin only)
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    if (req.user) {
      await logAction({
        userId: req.user._id,
        action: 'DELETE_SUBJECT',
        entity: 'Subject',
        entityId: subject._id,
        details: { name: subject.name, code: subject.code },
      });
    }

    res.status(200).json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};

