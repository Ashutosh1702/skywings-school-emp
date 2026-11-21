const School = require('../models/School');
const Banner = require('../models/Banner');
const Gallery = require('../models/Gallery');
const Announcement = require('../models/Announcement');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Section = require('../models/Section');
const Timetable = require('../models/Timetable');
const AcademicSession = require('../models/AcademicSession');

// @desc    Get aggregated public website data
// @route   GET /api/public/website-data
// @access  Public
const getPublicWebsiteData = async (req, res, next) => {
  try {
    let school = await School.findOne().populate('currentAcademicSession');
    if (!school) {
      school = await School.create({
        name: 'Skywings International Academy',
        code: 'SKYWINGS-001',
        email: 'admin@skywingsschool.com',
        phone: '+91 98765 43210',
      });
    }

    const [banners, gallery, notices, events, teachers, classes, sessions] =
      await Promise.all([
        Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
        Gallery.find().sort({ isFeatured: -1, order: 1, createdAt: -1 }).limit(16),
        Announcement.find({
          status: 'published',
          category: { $in: ['notice', 'circular', 'news'] },
        })
          .sort({ createdAt: -1 })
          .limit(8),
        Announcement.find({
          status: 'published',
          category: { $in: ['event', 'calendar'] },
        })
          .sort({ eventDate: 1, createdAt: -1 })
          .limit(8),
        Teacher.find({ status: 'active' })
          .select('name designation department qualification photo subjects')
          .populate('subjects', 'name code'),
        Class.find().select('name numericGrade sections').populate('sections', 'name roomNumber'),
        AcademicSession.find().sort({ startDate: -1 }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        school,
        banners,
        gallery,
        notices,
        events,
        teachers,
        classes,
        sessions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public timetable for a selected class and section
// @route   GET /api/public/timetable
// @access  Public
const getPublicTimetable = async (req, res, next) => {
  try {
    const { classId, sectionId } = req.query;
    let query = {};

    if (classId) query.class = classId;
    if (sectionId) query.section = sectionId;

    const timetable = await Timetable.find(query)
      .populate('subject', 'name code')
      .populate('teacher', 'name employeeId designation')
      .populate('class', 'name numericGrade')
      .populate('section', 'name')
      .sort({ dayOfWeek: 1, periodNumber: 1 });

    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicWebsiteData,
  getPublicTimetable,
};

