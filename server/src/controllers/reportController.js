const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const StudentFee = require('../models/StudentFee');
const Payment = require('../models/Payment');
const Mark = require('../models/Mark');

// @desc    Get Student Report
// @route   GET /api/reports/students
// @access  Private (Admin only)
const getStudentReport = async (req, res, next) => {
  try {
    const { classId, sectionId, status } = req.query;
    const query = {};
    if (classId) query.class = classId;
    if (sectionId) query.section = sectionId;
    if (status) query.status = status;

    const students = await Student.find(query)
      .populate('class', 'name')
      .populate('section', 'name')
      .populate('parent', 'fatherName phone')
      .sort({ rollNumber: 1 });

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Fee Collection Report
// @route   GET /api/reports/fees
// @access  Private (Admin only)
const getFeeReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.paymentDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const payments = await Payment.find(query)
      .populate('student', 'firstName lastName admissionNumber rollNumber class')
      .populate('collectedBy', 'name')
      .sort({ paymentDate: -1 });

    const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      success: true,
      count: payments.length,
      totalCollected,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Pending Fee Dues Report
// @route   GET /api/reports/pending-fees
// @access  Private (Admin only)
const getPendingFeeReport = async (req, res, next) => {
  try {
    const pendingFees = await StudentFee.find({ balance: { $gt: 0 } })
      .populate({
        path: 'student',
        populate: [
          { path: 'class', select: 'name' },
          { path: 'section', select: 'name' },
          { path: 'parent', select: 'fatherName phone email' },
        ],
      })
      .populate('academicSession', 'name');

    const totalOutstanding = pendingFees.reduce((sum, f) => sum + f.balance, 0);

    res.status(200).json({
      success: true,
      count: pendingFees.length,
      totalOutstanding,
      data: pendingFees,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentReport,
  getFeeReport,
  getPendingFeeReport,
};

