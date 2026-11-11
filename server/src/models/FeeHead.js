const mongoose = require('mongoose');

const feeHeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Fee head name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Fee head code is required (e.g. TUITION, ADMISSION)'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    isRefundable: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeeHead', feeHeadSchema);

