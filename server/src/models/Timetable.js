const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'Section is required'],
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: [true, 'Academic session is required'],
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: [true, 'Day of week is required'],
    },
    periodNumber: {
      type: Number,
      required: [true, 'Period number is required (1-8)'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (e.g. 08:30)'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required (e.g. 09:15)'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'Teacher is required'],
    },
    roomNumber: {
      type: String,
      default: '101',
    },
  },
  { timestamps: true }
);

// Prevent same class & section having multiple periods at the same day & periodNumber
timetableSchema.index(
  { class: 1, section: 1, academicSession: 1, dayOfWeek: 1, periodNumber: 1 },
  { unique: true }
);

// Prevent same teacher being assigned in multiple classes at the same day & periodNumber
timetableSchema.index(
  { teacher: 1, academicSession: 1, dayOfWeek: 1, periodNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model('Timetable', timetableSchema);

