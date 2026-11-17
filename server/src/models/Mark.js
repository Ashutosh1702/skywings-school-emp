const mongoose = require('mongoose');

const markSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    percentage: {
      type: Number,
    },
    grade: {
      type: String,
      default: 'A',
    },
    remarks: {
      type: String,
      default: '',
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
  },
  { timestamps: true }
);

// Grade calculation helper
markSchema.pre('save', function (next) {
  if (this.maxMarks > 0) {
    this.percentage = Math.round((this.marksObtained / this.maxMarks) * 100 * 10) / 10;
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B+';
    else if (this.percentage >= 60) this.grade = 'B';
    else if (this.percentage >= 50) this.grade = 'C';
    else if (this.percentage >= 35) this.grade = 'D';
    else this.grade = 'F';
  }
  next();
});

// Composite index to avoid duplicate marks entry for same student + exam + subject
markSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);

