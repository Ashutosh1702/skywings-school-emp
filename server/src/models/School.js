const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      default: 'Skywings International Academy',
    },
    code: {
      type: String,
      required: [true, 'School registration code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      default: 'SKYWINGS-001',
    },
    affiliationNumber: {
      type: String,
      trim: true,
      default: 'CBSE-2026-9874',
    },
    logo: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'School email is required'],
      trim: true,
      lowercase: true,
      default: 'admin@skywingsschool.com',
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
      default: '+91 98765 43210',
    },
    address: {
      street: { type: String, default: 'Plot No. 42, Tech Park Enclave' },
      city: { type: String, default: 'Bangalore' },
      state: { type: String, default: 'Karnataka' },
      zipCode: { type: String, default: '560001' },
      country: { type: String, default: 'India' },
    },
    website: {
      type: String,
      default: 'https://skywingsschool.com',
    },
    currentAcademicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('School', schoolSchema);

