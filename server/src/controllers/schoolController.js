const School = require('../models/School');
const AcademicSession = require('../models/AcademicSession');
const { logAction } = require('../utils/auditLogger');

// @desc    Get School Profile
// @route   GET /api/school
// @access  Public / Private
const getSchoolProfile = async (req, res, next) => {
  try {
    let school = await School.findOne().populate('currentAcademicSession');
    if (!school) {
      school = await School.create({
        name: 'Skywings International Academy',
        code: 'SKYWINGS-001',
        email: 'admin@skywingsschool.com',
        phone: '+91 98765 43210',
      });
    }
    res.status(200).json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
};

// @desc    Update School Profile
// @route   PUT /api/school
// @access  Private (Admin only)
const updateSchoolProfile = async (req, res, next) => {
  try {
    let school = await School.findOne();
    if (!school) {
      school = await School.create(req.body);
    } else {
      school = await School.findByIdAndUpdate(school._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await logAction({
      userId: req.user._id,
      action: 'UPDATE_SCHOOL_PROFILE',
      entity: 'School',
      entityId: school._id,
      details: req.body,
    });

    res.status(200).json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Academic Sessions
// @route   GET /api/school/sessions
// @access  Private
const getAcademicSessions = async (req, res, next) => {
  try {
    const sessions = await AcademicSession.find().sort({ startDate: -1 });
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an Academic Session
// @route   POST /api/school/sessions
// @access  Private (Admin only)
const createAcademicSession = async (req, res, next) => {
  try {
    const { name, startDate, endDate, isCurrent } = req.body;

    if (isCurrent) {
      await AcademicSession.updateMany({}, { isCurrent: false });
    }

    const session = await AcademicSession.create({
      name,
      startDate,
      endDate,
      isCurrent: !!isCurrent,
    });

    if (isCurrent) {
      await School.findOneAndUpdate({}, { currentAcademicSession: session._id });
    }

    await logAction({
      userId: req.user._id,
      action: 'CREATE_ACADEMIC_SESSION',
      entity: 'AcademicSession',
      entityId: session._id,
      details: { name, startDate, endDate },
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchoolProfile,
  updateSchoolProfile,
  getAcademicSessions,
  createAcademicSession,
};

