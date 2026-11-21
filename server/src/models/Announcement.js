const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    targetAudience: {
      type: [String],
      enum: ['all', 'teachers', 'parents', 'students'],
      default: ['all'],
    },
    targetClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      default: null,
    },
    priority: {
      type: String,
      enum: ['normal', 'important', 'urgent'],
      default: 'normal',
    },
    category: {
      type: String,
      enum: ['notice', 'event', 'calendar', 'news', 'circular'],
      default: 'notice',
    },
    eventDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    isPublicWebsite: {
      type: Boolean,
      default: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);

