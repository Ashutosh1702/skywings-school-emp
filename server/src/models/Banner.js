const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Banner image URL is required'],
    },
    badgeText: {
      type: String,
      default: 'Admissions Open 2026-27',
      trim: true,
    },
    buttonText: {
      type: String,
      default: 'Explore Academics',
      trim: true,
    },
    linkUrl: {
      type: String,
      default: '/academics',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);

