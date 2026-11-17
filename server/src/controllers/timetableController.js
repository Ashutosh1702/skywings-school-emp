const Timetable = require('../models/Timetable');
const { logAction } = require('../utils/auditLogger');

// @desc    Get timetable by class and section or teacher
// @route   GET /api/timetable
// @access  Private
const getTimetable = async (req, res, next) => {
  try {
    const { classId, sectionId, teacherId, dayOfWeek } = req.query;
    const query = {};

    if (classId) query.class = classId;
    if (sectionId) query.section = sectionId;
    if (teacherId) query.teacher = teacherId;
    if (dayOfWeek) query.dayOfWeek = dayOfWeek;

    const timetable = await Timetable.find(query)
      .sort({ dayOfWeek: 1, periodNumber: 1 })
      .populate('class', 'name')
      .populate('section', 'name')
      .populate('subject', 'name code')
      .populate('teacher', 'name employeeId email');

    res.status(200).json({ success: true, count: timetable.length, data: timetable });
  } catch (error) {
    next(error);
  }
};

// @desc    Create timetable slot with conflict checking
// @route   POST /api/timetable
// @access  Private (Admin only)
const createTimetableSlot = async (req, res, next) => {
  try {
    const {
      class: classId,
      section: sectionId,
      academicSession: sessionId,
      dayOfWeek,
      periodNumber,
      startTime,
      endTime,
      subject: subjectId,
      teacher: teacherId,
      roomNumber,
    } = req.body;

    // Check conflict 1: Class & Section already has a period assigned at this slot
    const classConflict = await Timetable.findOne({
      class: classId,
      section: sectionId,
      academicSession: sessionId,
      dayOfWeek,
      periodNumber,
    }).populate('subject', 'name');

    if (classConflict) {
      return res.status(400).json({
        success: false,
        message: `Conflict: Period ${periodNumber} on ${dayOfWeek} is already assigned to ${classConflict.subject.name}`,
      });
    }

    // Check conflict 2: Teacher is already teaching another class during this slot
    const teacherConflict = await Timetable.findOne({
      teacher: teacherId,
      academicSession: sessionId,
      dayOfWeek,
      periodNumber,
    })
      .populate('class', 'name')
      .populate('section', 'name');

    if (teacherConflict) {
      return res.status(400).json({
        success: false,
        message: `Teacher Conflict: This teacher is already assigned to ${teacherConflict.class.name} - Sec ${teacherConflict.section.name} on ${dayOfWeek} during Period ${periodNumber}`,
      });
    }

    const slot = await Timetable.create({
      class: classId,
      section: sectionId,
      academicSession: sessionId,
      dayOfWeek,
      periodNumber,
      startTime,
      endTime,
      subject: subjectId,
      teacher: teacherId,
      roomNumber: roomNumber || '101',
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_TIMETABLE_SLOT',
      entity: 'Timetable',
      entityId: slot._id,
      details: { dayOfWeek, periodNumber, teacherId },
    });

    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a timetable slot
// @route   DELETE /api/timetable/:id
// @access  Private (Admin only)
const deleteTimetableSlot = async (req, res, next) => {
  try {
    const slot = await Timetable.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Timetable slot not found' });
    }

    await logAction({
      userId: req.user._id,
      action: 'DELETE_TIMETABLE_SLOT',
      entity: 'Timetable',
      entityId: req.params.id,
      details: {},
    });

    res.status(200).json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimetable,
  createTimetableSlot,
  deleteTimetableSlot,
};

