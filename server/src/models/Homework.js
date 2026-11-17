const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Homework title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Homework instructions are required'],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class assignment is required'],
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'Section assignment is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject assignment is required'],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Submission due date is required'],
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    status: {
      type: String,
      enum: ['assigned', 'evaluated', 'closed'],
      default: 'assigned',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Homework', homeworkSchema);

