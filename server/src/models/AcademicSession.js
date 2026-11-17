const mongoose = require('mongoose');

const academicSessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Academic session name is required (e.g. 2026-2027)'],
      unique: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'upcoming'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AcademicSession', academicSessionSchema);

