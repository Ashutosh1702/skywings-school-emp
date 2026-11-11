const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    studentFee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentFee',
      required: true,
    },
    installmentNumber: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: [1, 'Payment amount must be greater than zero'],
    },
    remainingBalance: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'net_banking', 'cheque'],
      required: true,
    },
    transactionId: {
      type: String,
      trim: true,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['successful', 'pending', 'failed', 'refunded'],
      default: 'successful',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

