const Payment = require('../models/Payment');
const StudentFee = require('../models/StudentFee');
const Student = require('../models/Student');
const { logAction } = require('../utils/auditLogger');

// Helper to generate receipt number
const generateReceiptNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `REC-${new Date().getFullYear()}-${timestamp}${random}`;
};

// @desc    Record a fee payment
// @route   POST /api/payments
// @access  Private (Admin / Accountant)
const recordPayment = async (req, res, next) => {
  try {
    const {
      studentId,
      installmentNumber,
      amount,
      paymentMethod,
      transactionId,
      remarks,
    } = req.body;

    const paymentAmount = Number(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    const studentFee = await StudentFee.findOne({ student: studentId });
    if (!studentFee) {
      return res.status(404).json({ success: false, message: 'Student fee ledger not found' });
    }

    // Find target installment
    const installment = studentFee.installments.find(
      (inst) => inst.installmentNumber === Number(installmentNumber)
    );

    if (!installment) {
      return res.status(404).json({ success: false, message: 'Target installment not found' });
    }

    if (installment.status === 'paid') {
      return res.status(400).json({ success: false, message: 'This installment has already been paid in full' });
    }

    // Allocate payment
    installment.paidAmount = (installment.paidAmount || 0) + paymentAmount;
    installment.balanceAmount = Math.max(0, installment.amount - installment.paidAmount);

    if (installment.balanceAmount === 0) {
      installment.status = 'paid';
    }

    // Update overall totals
    studentFee.totalPaid = (studentFee.totalPaid || 0) + paymentAmount;
    studentFee.balance = Math.max(0, studentFee.netPayable - studentFee.totalPaid);

    if (studentFee.balance === 0) {
      studentFee.overallStatus = 'paid';
    } else {
      studentFee.overallStatus = 'due';
    }

    await studentFee.save();

    // Create payment transaction
    const receiptNumber = generateReceiptNumber();
    const payment = await Payment.create({
      receiptNumber,
      student: studentId,
      studentFee: studentFee._id,
      installmentNumber: Number(installmentNumber),
      amountPaid: paymentAmount,
      remainingBalance: studentFee.balance,
      paymentMethod,
      transactionId: transactionId || '',
      remarks: remarks || '',
      collectedBy: req.user._id,
      status: 'successful',
    });

    await logAction({
      userId: req.user._id,
      action: 'RECORD_PAYMENT',
      entity: 'Payment',
      entityId: payment._id,
      details: { receiptNumber, studentId, amountPaid: paymentAmount },
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments / collection history
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const { studentId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (studentId) query.student = studentId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('student', 'firstName lastName admissionNumber rollNumber class section')
      .populate('collectedBy', 'name');

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment receipt by ID or Receipt Number
// @route   GET /api/payments/receipt/:receiptNumber
// @access  Private
const getReceipt = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ receiptNumber: req.params.receiptNumber })
      .populate({
        path: 'student',
        populate: [
          { path: 'class', select: 'name' },
          { path: 'section', select: 'name' },
          { path: 'parent', select: 'fatherName phone' },
        ],
      })
      .populate('collectedBy', 'name email');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordPayment,
  getPayments,
  getReceipt,
};

