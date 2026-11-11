const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Section name is required (e.g. A, B, C)'],
      trim: true,
      uppercase: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class reference is required'],
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
    roomNumber: {
      type: String,
      trim: true,
      default: 'Room 101',
    },
    capacity: {
      type: Number,
      default: 40,
    },
  },
  { timestamps: true }
);

sectionSchema.index({ class: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Section', sectionSchema);

