const FeeHead = require('../models/FeeHead');
const FeeStructure = require('../models/FeeStructure');
const StudentFee = require('../models/StudentFee');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all Fee Heads
// @route   GET /api/fees/heads
// @access  Private
const getFeeHeads = async (req, res, next) => {
  try {
    const feeHeads = await FeeHead.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: feeHeads.length, data: feeHeads });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a Fee Head
// @route   POST /api/fees/heads
// @access  Private (Admin only)
const createFeeHead = async (req, res, next) => {
  try {
    const { name, code, description, isRefundable } = req.body;

    const existing = await FeeHead.findOne({
      $or: [{ code: code.toUpperCase() }, { name }],
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Fee Head or code already exists' });
    }

    const feeHead = await FeeHead.create({
      name,
      code: code.toUpperCase(),
      description,
      isRefundable: !!isRefundable,
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_FEE_HEAD',
      entity: 'FeeHead',
      entityId: feeHead._id,
      details: { name, code },
    });

    res.status(201).json({ success: true, data: feeHead });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Fee Structures
// @route   GET /api/fees/structures
// @access  Private
const getFeeStructures = async (req, res, next) => {
  try {
    const structures = await FeeStructure.find({ status: 'active' })
      .populate('academicSession', 'name')
      .populate('class', 'name numericGrade')
      .populate('breakdown.feeHead', 'name code');

    res.status(200).json({ success: true, count: structures.length, data: structures });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a Fee Structure
// @route   POST /api/fees/structures
// @access  Private (Admin only)
const createFeeStructure = async (req, res, next) => {
  try {
    const { name, academicSession, class: classId, frequency, breakdown, installments } = req.body;

    // Backend calculation of totalAmount
    const totalAmount = breakdown.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const feeStructure = await FeeStructure.create({
      name,
      academicSession,
      class: classId,
      frequency: frequency || 'quarterly',
      breakdown,
      totalAmount,
      installments: installments || [],
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_FEE_STRUCTURE',
      entity: 'FeeStructure',
      entityId: feeStructure._id,
      details: { name, totalAmount },
    });

    res.status(201).json({ success: true, data: feeStructure });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student Fee Details / Ledger
// @route   GET /api/fees/student/:studentId
// @access  Private
const getStudentFee = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Parent permission check
    if (req.user.role === 'parent') {
      const parent = await Parent.findOne({ user: req.user._id });
      if (!parent || !parent.children.map((c) => c.toString()).includes(studentId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this student fee record',
        });
      }
    }

    const studentFee = await StudentFee.findOne({ student: studentId })
      .populate('student', 'firstName lastName admissionNumber rollNumber')
      .populate('academicSession', 'name')
      .populate({
        path: 'feeStructure',
        populate: { path: 'breakdown.feeHead', select: 'name code' },
      });

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: 'No fee record assigned for this student',
      });
    }

    // Refresh installment statuses based on current date
    const now = new Date();
    studentFee.installments.forEach((inst) => {
      if (inst.paidAmount >= inst.amount) {
        inst.status = 'paid';
      } else if (new Date(inst.dueDate) < now) {
        inst.status = 'overdue';
      } else {
        inst.status = 'due';
      }
    });

    res.status(200).json({ success: true, data: studentFee });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply Fee Concession / Discount
// @route   POST /api/fees/student/:studentId/concession
// @access  Private (Admin only)
const applyConcession = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { concessionAmount, reason } = req.body;

    const studentFee = await StudentFee.findOne({ student: studentId });
    if (!studentFee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    studentFee.concessionAmount = Number(concessionAmount);
    studentFee.concessionReason = reason || 'Admin Approved Concession';
    studentFee.netPayable = Math.max(0, studentFee.grossTotal - studentFee.concessionAmount);
    studentFee.balance = Math.max(0, studentFee.netPayable - studentFee.totalPaid);

    if (studentFee.balance === 0) {
      studentFee.overallStatus = 'paid';
    }

    await studentFee.save();

    await logAction({
      userId: req.user._id,
      action: 'APPLY_FEE_CONCESSION',
      entity: 'StudentFee',
      entityId: studentFee._id,
      details: { concessionAmount, reason },
    });

    res.status(200).json({ success: true, data: studentFee });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeeHeads,
  createFeeHead,
  getFeeStructures,
  createFeeStructure,
  getStudentFee,
  applyConcession,
};

