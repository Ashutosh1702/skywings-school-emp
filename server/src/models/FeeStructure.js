const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Fee structure name is required (e.g. Primary School 2026-27)'],
      trim: true,
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: [true, 'Academic session is required'],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'annually', 'one_time'],
      default: 'quarterly',
    },
    breakdown: [
      {
        feeHead: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'FeeHead',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: [0, 'Amount cannot be negative'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    installments: [
      {
        installmentNumber: Number,
        name: String, // e.g. "Term 1 (April - June)"
        dueDate: Date,
        amount: Number,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

feeStructureSchema.index({ academicSession: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);

