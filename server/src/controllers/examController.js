const Exam = require('../models/Exam');
const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getExams = async (req, res, next) => {
  try {
    const { classId, sessionId } = req.query;
    const query = {};

    if (classId) query.class = classId;
    if (sessionId) query.academicSession = sessionId;

    const exams = await Exam.find(query)
      .sort({ startDate: -1 })
      .populate('class', 'name numericGrade')
      .populate('academicSession', 'name')
      .populate('subjects.subject', 'name code');

    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an Exam
// @route   POST /api/exams
// @access  Private (Admin only)
const createExam = async (req, res, next) => {
  try {
    const { name, examType, academicSession, class: classId, startDate, endDate, subjects } = req.body;

    const exam = await Exam.create({
      name,
      examType,
      academicSession,
      class: classId,
      startDate,
      endDate,
      subjects: subjects || [],
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_EXAM',
      entity: 'Exam',
      entityId: exam._id,
      details: { name, examType, classId },
    });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

// @desc    Enter or update marks for a subject
// @route   POST /api/exams/:examId/marks
// @access  Private (Teacher / Admin)
const submitMarks = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { classId, sectionId, subjectId, marksList } = req.body;

    if (!marksList || !Array.isArray(marksList) || marksList.length === 0) {
      return res.status(400).json({ success: false, message: 'No marks provided' });
    }

    // Get teacher id if user is teacher
    let teacherId = null;
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: req.user._id });
      teacherId = teacher?._id;
    } else {
      const firstTeacher = await Teacher.findOne();
      teacherId = firstTeacher?._id || req.user._id;
    }

    const bulkOps = marksList.map((item) => {
      const maxMarks = item.maxMarks || 100;
      const percentage = Math.round((item.marksObtained / maxMarks) * 100 * 10) / 10;
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else if (percentage >= 35) grade = 'D';

      return {
        updateOne: {
          filter: { exam: examId, student: item.studentId, subject: subjectId },
          update: {
            $set: {
              class: classId,
              section: sectionId,
              marksObtained: item.marksObtained,
              maxMarks,
              percentage,
              grade,
              remarks: item.remarks || '',
              evaluatedBy: teacherId,
            },
          },
          upsert: true,
        },
      };
    });

    await Mark.bulkWrite(bulkOps);

    await logAction({
      userId: req.user._id,
      action: 'SUBMIT_MARKS',
      entity: 'Mark',
      details: { examId, subjectId, count: marksList.length },
    });

    res.status(200).json({ success: true, message: 'Marks recorded successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student Report Card for an exam
// @route   GET /api/exams/:examId/student/:studentId
// @access  Private
const getStudentReportCard = async (req, res, next) => {
  try {
    const { examId, studentId } = req.params;

    // Parent permission check
    if (req.user.role === 'parent') {
      const parent = await Parent.findOne({ user: req.user._id });
      if (!parent || !parent.children.map((c) => c.toString()).includes(studentId)) {
        return res.status(403).json({ success: false, message: 'Access denied to this student result' });
      }
    }

    const exam = await Exam.findById(examId)
      .populate('class', 'name')
      .populate('academicSession', 'name');

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const student = await Student.findById(studentId)
      .populate('class', 'name')
      .populate('section', 'name');

    const marks = await Mark.find({ exam: examId, student: studentId })
      .populate('subject', 'name code')
      .populate('evaluatedBy', 'name');

    const totalMarksObtained = marks.reduce((sum, m) => sum + m.marksObtained, 0);
    const totalMaxMarks = marks.reduce((sum, m) => sum + m.maxMarks, 0);
    const overallPercentage =
      totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 100 * 10) / 10 : 0;

    let overallGrade = 'F';
    if (overallPercentage >= 90) overallGrade = 'A+';
    else if (overallPercentage >= 80) overallGrade = 'A';
    else if (overallPercentage >= 70) overallGrade = 'B+';
    else if (overallPercentage >= 60) overallGrade = 'B';
    else if (overallPercentage >= 50) overallGrade = 'C';
    else if (overallPercentage >= 35) overallGrade = 'D';

    res.status(200).json({
      success: true,
      data: {
        exam,
        student,
        marks,
        summary: {
          totalMarksObtained,
          totalMaxMarks,
          overallPercentage,
          overallGrade,
          isPassed: overallPercentage >= 35,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExams,
  createExam,
  submitMarks,
  getStudentReportCard,
};

