const mongoose = require('mongoose');

const studentFeeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: true,
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: true,
    },
    grossTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    concessionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    concessionReason: {
      type: String,
      default: '',
    },
    netPayable: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
    },
    overallStatus: {
      type: String,
      enum: ['upcoming', 'due', 'overdue', 'paid'],
      default: 'upcoming',
    },
    installments: [
      {
        installmentNumber: Number,
        name: String,
        dueDate: Date,
        amount: Number,
        paidAmount: { type: Number, default: 0 },
        balanceAmount: Number,
        status: {
          type: String,
          enum: ['upcoming', 'due', 'overdue', 'paid'],
          default: 'upcoming',
        },
      },
    ],
  },
  { timestamps: true }
);

studentFeeSchema.index({ student: 1, academicSession: 1 }, { unique: true });

module.exports = mongoose.model('StudentFee', studentFeeSchema);

