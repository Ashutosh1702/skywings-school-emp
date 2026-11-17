const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const { logAction } = require('../utils/auditLogger');

// Helper to normalize date to midnight UTC/local
const normalizeDate = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

// @desc    Get attendance for a class on a specific date
// @route   GET /api/attendance
// @access  Private
const getClassAttendance = async (req, res, next) => {
  try {
    const { classId, sectionId, date } = req.query;

    if (!classId || !sectionId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide classId, sectionId and date',
      });
    }

    const targetDate = normalizeDate(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Fetch all students enrolled in class & section
    const students = await Student.find({
      class: classId,
      section: sectionId,
      status: 'active',
    }).sort({ rollNumber: 1 });

    // Fetch existing attendance records
    const attendanceRecords = await Attendance.find({
      class: classId,
      section: sectionId,
      date: { $gte: targetDate, $lt: nextDate },
    });

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      attendanceMap[record.student.toString()] = record;
    });

    // Combine student list with attendance status
    const result = students.map((s) => ({
      studentId: s._id,
      admissionNumber: s.admissionNumber,
      rollNumber: s.rollNumber,
      name: `${s.firstName} ${s.lastName}`,
      status: attendanceMap[s._id.toString()]?.status || 'present',
      remarks: attendanceMap[s._id.toString()]?.remarks || '',
      attendanceId: attendanceMap[s._id.toString()]?._id || null,
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      date: targetDate,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Update bulk daily attendance for a class
// @route   POST /api/attendance/bulk
// @access  Private (Teacher/Admin only)
const saveBulkAttendance = async (req, res, next) => {
  try {
    const { classId, sectionId, academicSession, date, records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'No attendance records provided' });
    }

    const targetDate = normalizeDate(date);

    const bulkOps = records.map((item) => ({
      updateOne: {
        filter: { student: item.studentId, date: targetDate },
        update: {
          $set: {
            class: classId,
            section: sectionId,
            academicSession,
            date: targetDate,
            status: item.status,
            remarks: item.remarks || '',
            markedBy: req.user._id,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    await logAction({
      userId: req.user._id,
      action: 'RECORD_ATTENDANCE',
      entity: 'Attendance',
      details: { classId, sectionId, date: targetDate, count: records.length },
    });

    res.status(200).json({ success: true, message: 'Attendance recorded successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance summary for a student
// @route   GET /api/attendance/student/:studentId
// @access  Private
const getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Security check for Parent role: must be their child
    if (req.user.role === 'parent') {
      const parent = await Parent.findOne({ user: req.user._id });
      if (!parent || !parent.children.map((c) => c.toString()).includes(studentId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view attendance for your linked children.',
        });
      }
    }

    const records = await Attendance.find({ student: studentId })
      .sort({ date: -1 })
      .populate('class', 'name')
      .populate('section', 'name');

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === 'present').length;
    const absentDays = records.filter((r) => r.status === 'absent').length;
    const lateDays = records.filter((r) => r.status === 'late').length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100 * 10) / 10 : 100;

    res.status(200).json({
      success: true,
      summary: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        percentage,
      },
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClassAttendance,
  saveBulkAttendance,
  getStudentAttendance,
};

