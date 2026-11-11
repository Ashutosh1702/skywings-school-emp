const Homework = require('../models/Homework');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const { logAction } = require('../utils/auditLogger');

// @desc    Get homework with filters
// @route   GET /api/homework
// @access  Private
const getHomework = async (req, res, next) => {
  try {
    const { classId, sectionId, subjectId } = req.query;
    const query = {};

    if (classId) query.class = classId;
    if (sectionId) query.section = sectionId;
    if (subjectId) query.subject = subjectId;

    const homeworkList = await Homework.find(query)
      .sort({ dueDate: -1 })
      .populate('class', 'name')
      .populate('section', 'name')
      .populate('subject', 'name code')
      .populate('assignedBy', 'name email');

    res.status(200).json({ success: true, count: homeworkList.length, data: homeworkList });
  } catch (error) {
    next(error);
  }
};

// @desc    Create homework
// @route   POST /api/homework
// @access  Private (Teacher / Admin)
const createHomework = async (req, res, next) => {
  try {
    const { title, description, class: classId, section: sectionId, subject: subjectId, dueDate, attachments } = req.body;

    let teacherId = null;
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: req.user._id });
      teacherId = teacher?._id;
    } else {
      const firstTeacher = await Teacher.findOne();
      teacherId = firstTeacher?._id || req.user._id;
    }

    const homework = await Homework.create({
      title,
      description,
      class: classId,
      section: sectionId,
      subject: subjectId,
      assignedBy: teacherId,
      dueDate,
      attachments: attachments || [],
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_HOMEWORK',
      entity: 'Homework',
      entityId: homework._id,
      details: { title, classId, dueDate },
    });

    res.status(201).json({ success: true, data: homework });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHomework,
  createHomework,
};

