const Student = require('../models/Student');
const User = require('../models/User');
const FeeStructure = require('../models/FeeStructure');
const StudentFee = require('../models/StudentFee');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all students with filters, pagination, search
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    const {
      search,
      classId,
      sectionId,
      sessionId,
      status = 'active',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (classId) query.class = classId;
    if (sectionId) query.section = sectionId;
    if (sessionId) query.academicSession = sessionId;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('class', 'name numericGrade')
      .populate('section', 'name roomNumber')
      .populate('academicSession', 'name')
      .populate('parent', 'fatherName motherName phone email');

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register / Admit new student
// @route   POST /api/students
// @access  Private (Admin only)
const createStudent = async (req, res, next) => {
  try {
    const {
      admissionNumber,
      rollNumber,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      bloodGroup,
      class: classId,
      section: sectionId,
      academicSession: sessionId,
      parent: parentId,
      email,
      phone,
      address,
    } = req.body;

    // Check unique admission number
    const existingAdmission = await Student.findOne({ admissionNumber: admissionNumber.toUpperCase() });
    if (existingAdmission) {
      return res.status(400).json({
        success: false,
        message: `Student with Admission Number ${admissionNumber} already exists`,
      });
    }

    // Check roll number uniqueness within class, section & session
    const existingRoll = await Student.findOne({
      class: classId,
      section: sectionId,
      academicSession: sessionId,
      rollNumber,
    });
    if (existingRoll) {
      return res.status(400).json({
        success: false,
        message: `Roll Number ${rollNumber} is already assigned in this section`,
      });
    }

    const student = await Student.create({
      admissionNumber: admissionNumber.toUpperCase(),
      rollNumber,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      bloodGroup: bloodGroup || 'Unknown',
      class: classId,
      section: sectionId,
      academicSession: sessionId,
      parent: parentId || null,
      email: email || '',
      phone: phone || '',
      address: address || {},
    });

    // Check if a FeeStructure exists for this class & session, and automatically assign
    const feeStructure = await FeeStructure.findOne({
      class: classId,
      academicSession: sessionId,
      status: 'active',
    });

    if (feeStructure) {
      const installments = feeStructure.installments.map((inst) => ({
        installmentNumber: inst.installmentNumber,
        name: inst.name,
        dueDate: inst.dueDate,
        amount: inst.amount,
        paidAmount: 0,
        balanceAmount: inst.amount,
        status: new Date(inst.dueDate) < new Date() ? 'overdue' : 'due',
      }));

      await StudentFee.create({
        student: student._id,
        academicSession: sessionId,
        feeStructure: feeStructure._id,
        grossTotal: feeStructure.totalAmount,
        netPayable: feeStructure.totalAmount,
        totalPaid: 0,
        balance: feeStructure.totalAmount,
        overallStatus: 'due',
        installments,
      });
    }

    await logAction({
      userId: req.user._id,
      action: 'ADMIT_STUDENT',
      entity: 'Student',
      entityId: student._id,
      details: { admissionNumber, name: `${firstName} ${lastName}` },
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('class', 'name numericGrade')
      .populate('section', 'name roomNumber')
      .populate('academicSession', 'name')
      .populate('parent', 'fatherName motherName phone email occupation address');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private (Admin only)
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await logAction({
      userId: req.user._id,
      action: 'UPDATE_STUDENT',
      entity: 'Student',
      entityId: student._id,
      details: req.body,
    });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate or change student status
// @route   PATCH /api/students/:id/status
// @access  Private (Admin only)
const updateStudentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await logAction({
      userId: req.user._id,
      action: 'CHANGE_STUDENT_STATUS',
      entity: 'Student',
      entityId: student._id,
      details: { newStatus: status },
    });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  updateStudentStatus,
};

