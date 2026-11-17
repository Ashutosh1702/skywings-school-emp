const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required (e.g. Grade 1, Grade 10)'],
      trim: true,
    },
    numericGrade: {
      type: Number,
      required: [true, 'Numeric grade is required (e.g. 1 to 12)'],
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
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

module.exports = mongoose.model('Class', classSchema);

