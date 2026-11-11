require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const School = require('../models/School');
const AcademicSession = require('../models/AcademicSession');
const Class = require('../models/Class');
const Section = require('../models/Section');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');
const FeeHead = require('../models/FeeHead');
const FeeStructure = require('../models/FeeStructure');
const StudentFee = require('../models/StudentFee');
const Payment = require('../models/Payment');
const Exam = require('../models/Exam');
const Mark = require('../models/Mark');
const Homework = require('../models/Homework');
const Announcement = require('../models/Announcement');
const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');
const TransportRoute = require('../models/TransportRoute');

const seedData = async (exitOnComplete = true) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skywings_erp';
      await mongoose.connect(mongoUri);
    }
    console.log('Connected to MongoDB for comprehensive seeding...');

    // Clear existing records
    await Promise.all([
      User.deleteMany(),
      School.deleteMany(),
      AcademicSession.deleteMany(),
      Class.deleteMany(),
      Section.deleteMany(),
      Subject.deleteMany(),
      Teacher.deleteMany(),
      Parent.deleteMany(),
      Student.deleteMany(),
      Timetable.deleteMany(),
      Attendance.deleteMany(),
      FeeHead.deleteMany(),
      FeeStructure.deleteMany(),
      StudentFee.deleteMany(),
      Payment.deleteMany(),
      Exam.deleteMany(),
      Mark.deleteMany(),
      Homework.deleteMany(),
      Announcement.deleteMany(),
      Book.deleteMany(),
      BookIssue.deleteMany(),
      TransportRoute.deleteMany(),
    ]);
    console.log('Cleared all collections.');

    // 1. Create Default Academic Session
    const session = await AcademicSession.create({
      name: '2026-2027',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true,
      status: 'active',
    });

    // 2. Create School Profile
    const school = await School.create({
      name: 'Skywings International Academy',
      code: 'SKYWINGS-001',
      affiliationNumber: 'CBSE-2026-9874',
      email: 'admin@skywingsschool.com',
      phone: '+91 98765 43210',
      address: {
        street: 'Plot No. 42, Tech Park Enclave',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India',
      },
      currentAcademicSession: session._id,
    });

    // 3. Create Admin, Teacher & Parent Users
    const adminUser = await User.create({
      name: 'Dr. Rajesh Sharma (Principal)',
      email: 'admin@skywings.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const teacherUser = await User.create({
      name: 'Priya Mukherjee',
      email: 'teacher@skywings.com',
      password: 'Teacher@123',
      role: 'teacher',
    });

    const parentUser = await User.create({
      name: 'Vikramaditya Roy',
      email: 'parent@skywings.com',
      password: 'Parent@123',
      role: 'parent',
    });

    // 4. Create Classes & Sections
    const class10 = await Class.create({ name: 'Grade 10', numericGrade: 10 });
    const section10A = await Section.create({
      name: 'A',
      class: class10._id,
      roomNumber: 'Room 301',
      capacity: 40,
    });
    const section10B = await Section.create({
      name: 'B',
      class: class10._id,
      roomNumber: 'Room 302',
      capacity: 40,
    });
    class10.sections.push(section10A._id, section10B._id);
    await class10.save();

    const class9 = await Class.create({ name: 'Grade 9', numericGrade: 9 });
    const section9A = await Section.create({
      name: 'A',
      class: class9._id,
      roomNumber: 'Room 201',
      capacity: 40,
    });
    class9.sections.push(section9A._id);
    await class9.save();

    // 5. Create Core Subjects
    const mathSub = await Subject.create({
      name: 'Mathematics',
      code: 'MATH10',
      type: 'theory',
      classes: [class10._id, class9._id],
    });
    const scienceSub = await Subject.create({
      name: 'Science & Technology',
      code: 'SCI10',
      type: 'both',
      classes: [class10._id, class9._id],
    });
    const englishSub = await Subject.create({
      name: 'English Language & Lit',
      code: 'ENG10',
      type: 'theory',
      classes: [class10._id, class9._id],
    });

    // 6. Create Teacher Profile
    const teacherProfile = await Teacher.create({
      user: teacherUser._id,
      employeeId: 'EMP-T-101',
      name: 'Priya Mukherjee',
      email: 'teacher@skywings.com',
      phone: '+91 98450 12345',
      designation: 'Senior PGT Mathematics',
      department: 'Mathematics',
      qualification: 'M.Sc, M.Ed',
      subjects: [mathSub._id],
      assignedClasses: [{ class: class10._id, section: section10A._id }],
    });

    section10A.classTeacher = teacherProfile._id;
    await section10A.save();

    // 7. Create Parent Profile
    const parentProfile = await Parent.create({
      user: parentUser._id,
      fatherName: 'Vikramaditya Roy',
      motherName: 'Ananya Roy',
      email: 'parent@skywings.com',
      phone: '+91 97410 98765',
      occupation: 'Software Director',
      address: {
        street: 'Flat 4B, Prestige Palm Groves',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560066',
      },
    });

    // 8. Create Students
    const student1 = await Student.create({
      admissionNumber: 'ADM-2026-001',
      rollNumber: '101',
      firstName: 'Aarav',
      lastName: 'Roy',
      gender: 'male',
      dateOfBirth: new Date('2011-05-14'),
      bloodGroup: 'B+',
      class: class10._id,
      section: section10A._id,
      academicSession: session._id,
      parent: parentProfile._id,
      email: 'aarav.roy@student.skywings.com',
      phone: '+91 97410 98765',
    });

    const student2 = await Student.create({
      admissionNumber: 'ADM-2026-002',
      rollNumber: '102',
      firstName: 'Diya',
      lastName: 'Sharma',
      gender: 'female',
      dateOfBirth: new Date('2011-08-22'),
      bloodGroup: 'O+',
      class: class10._id,
      section: section10A._id,
      academicSession: session._id,
      email: 'diya.sharma@student.skywings.com',
      phone: '+91 98888 11111',
    });

    parentProfile.children.push(student1._id);
    await parentProfile.save();

    // 9. Create Fee Heads & Structure
    const tuitionHead = await FeeHead.create({
      name: 'Tuition Fee',
      code: 'TUITION',
      description: 'Term academic instruction fee',
    });
    const labHead = await FeeHead.create({
      name: 'Science & Computer Lab Fee',
      code: 'LAB',
      description: 'Laboratory maintenance & consumables',
    });
    const sportsHead = await FeeHead.create({
      name: 'Sports & Activities',
      code: 'SPORTS',
      description: 'Athletics & cultural clubs',
    });

    const feeStructure10 = await FeeStructure.create({
      name: 'Grade 10 Annual Comprehensive 2026-27',
      academicSession: session._id,
      class: class10._id,
      frequency: 'quarterly',
      breakdown: [
        { feeHead: tuitionHead._id, amount: 60000 },
        { feeHead: labHead._id, amount: 15000 },
        { feeHead: sportsHead._id, amount: 5000 },
      ],
      totalAmount: 80000,
      installments: [
        {
          installmentNumber: 1,
          name: 'Quarter 1 (Apr - Jun)',
          dueDate: new Date('2026-04-15'),
          amount: 20000,
        },
        {
          installmentNumber: 2,
          name: 'Quarter 2 (Jul - Sep)',
          dueDate: new Date('2026-07-15'),
          amount: 20000,
        },
        {
          installmentNumber: 3,
          name: 'Quarter 3 (Oct - Dec)',
          dueDate: new Date('2026-10-15'),
          amount: 20000,
        },
        {
          installmentNumber: 4,
          name: 'Quarter 4 (Jan - Mar)',
          dueDate: new Date('2027-01-15'),
          amount: 20000,
        },
      ],
    });

    // 10. Student Fee Ledger & Payment
    const studentFee1 = await StudentFee.create({
      student: student1._id,
      academicSession: session._id,
      feeStructure: feeStructure10._id,
      grossTotal: 80000,
      concessionAmount: 0,
      netPayable: 80000,
      totalPaid: 20000,
      balance: 60000,
      overallStatus: 'due',
      installments: [
        {
          installmentNumber: 1,
          name: 'Quarter 1 (Apr - Jun)',
          dueDate: new Date('2026-04-15'),
          amount: 20000,
          paidAmount: 20000,
          balanceAmount: 0,
          status: 'paid',
        },
        {
          installmentNumber: 2,
          name: 'Quarter 2 (Jul - Sep)',
          dueDate: new Date('2026-07-15'),
          amount: 20000,
          paidAmount: 0,
          balanceAmount: 20000,
          status: 'due',
        },
        {
          installmentNumber: 3,
          name: 'Quarter 3 (Oct - Dec)',
          dueDate: new Date('2026-10-15'),
          amount: 20000,
          paidAmount: 0,
          balanceAmount: 20000,
          status: 'upcoming',
        },
        {
          installmentNumber: 4,
          name: 'Quarter 4 (Jan - Mar)',
          dueDate: new Date('2027-01-15'),
          amount: 20000,
          paidAmount: 0,
          balanceAmount: 20000,
          status: 'upcoming',
        },
      ],
    });

    await Payment.create({
      receiptNumber: 'REC-2026-104921',
      student: student1._id,
      studentFee: studentFee1._id,
      installmentNumber: 1,
      amountPaid: 20000,
      remainingBalance: 60000,
      paymentMethod: 'upi',
      transactionId: 'UPI-AXIS-982741982',
      remarks: 'Quarter 1 Paid via UPI',
      collectedBy: adminUser._id,
    });

    // 11. Attendance Records
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Attendance.create({
      student: student1._id,
      class: class10._id,
      section: section10A._id,
      academicSession: session._id,
      date: today,
      status: 'present',
      remarks: 'On time',
      markedBy: adminUser._id,
    });

    await Attendance.create({
      student: student2._id,
      class: class10._id,
      section: section10A._id,
      academicSession: session._id,
      date: today,
      status: 'present',
      remarks: 'On time',
      markedBy: adminUser._id,
    });

    // 12. Examination & Marks
    const midTermExam = await Exam.create({
      name: 'Mid-Term Examinations 2026',
      examType: 'mid_term',
      academicSession: session._id,
      class: class10._id,
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-25'),
      subjects: [
        {
          subject: mathSub._id,
          examDate: new Date('2026-09-12'),
          startTime: '09:00',
          endTime: '12:00',
          maxMarks: 100,
          passingMarks: 35,
        },
        {
          subject: scienceSub._id,
          examDate: new Date('2026-09-15'),
          startTime: '09:00',
          endTime: '12:00',
          maxMarks: 100,
          passingMarks: 35,
        },
      ],
      status: 'results_published',
    });

    await Mark.create({
      exam: midTermExam._id,
      student: student1._id,
      class: class10._id,
      section: section10A._id,
      subject: mathSub._id,
      marksObtained: 94,
      maxMarks: 100,
      percentage: 94,
      grade: 'A+',
      remarks: 'Outstanding logical reasoning',
      evaluatedBy: teacherProfile._id,
    });

    await Mark.create({
      exam: midTermExam._id,
      student: student1._id,
      class: class10._id,
      section: section10A._id,
      subject: scienceSub._id,
      marksObtained: 88,
      maxMarks: 100,
      percentage: 88,
      grade: 'A',
      remarks: 'Excellent practical skills',
      evaluatedBy: teacherProfile._id,
    });

    // 13. Homework (Module 10)
    await Homework.create({
      title: 'Chapter 5 Quadratic Equations Problem Set',
      description: 'Solve questions 1 through 15 from textbook page 104 in math notebook.',
      class: class10._id,
      section: section10A._id,
      subject: mathSub._id,
      assignedBy: teacherProfile._id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    // 14. Announcement
    await Announcement.create({
      title: 'Annual Sports Meet & Cultural Showcase 2026',
      message:
        'Skywings International Academy is proud to host the Annual Sports Meet from November 20 to 22. All parents and students are warmly invited.',
      targetAudience: ['all'],
      priority: 'important',
      author: adminUser._id,
      status: 'published',
    });

    // 15. Library Books & Issue (Module 15)
    const book1 = await Book.create({
      isbn: 'ISBN-978-0132350884',
      title: 'Clean Code: A Handbook of Agile Craftsmanship',
      author: 'Robert C. Martin',
      category: 'Computer Science',
      rackNumber: 'Rack CS-1',
      totalCopies: 6,
      availableCopies: 5,
    });

    const book2 = await Book.create({
      isbn: 'ISBN-978-0199535569',
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      category: 'Science',
      rackNumber: 'Rack SCI-3',
      totalCopies: 8,
      availableCopies: 8,
    });

    await BookIssue.create({
      book: book1._id,
      student: student1._id,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      issuedBy: adminUser._id,
    });

    // 16. Transport Route & Stops (Module 16)
    await TransportRoute.create({
      routeName: 'Route 1 - Tech Park to Whitefield',
      vehicleNumber: 'KA-01-EQ-9874',
      driverName: 'Manjunath Gowda',
      driverPhone: '+91 98450 67890',
      vehicleCapacity: 35,
      stops: [
        { stopName: 'HSR Layout BDA', pickupTime: '07:15', dropTime: '15:45', monthlyFee: 2400 },
        { stopName: 'Bellandur EcoSpace', pickupTime: '07:35', dropTime: '15:25', monthlyFee: 2600 },
        { stopName: 'Kadubeesanahalli Junction', pickupTime: '07:50', dropTime: '15:10', monthlyFee: 2800 },
      ],
    });

    console.log('Complete database seeding successfully finished!');
    console.log('----------------------------------------------------');
    console.log('Login credentials:');
    console.log('Admin:   admin@skywings.com   / Admin@123');
    console.log('Teacher: teacher@skywings.com / Teacher@123');
    console.log('Parent:  parent@skywings.com  / Parent@123');
    console.log('----------------------------------------------------');

    if (exitOnComplete) {
      process.exit(0);
    }
    return true;
  } catch (err) {
    console.error('Seeding error:', err);
    if (exitOnComplete) {
      process.exit(1);
    }
    throw err;
  }
};

const autoSeedIfNeeded = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding initial SkyWings ERP demo data...');
      await seedData(false);
    }
  } catch (err) {
    console.warn('Auto-seed check notice:', err.message);
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = { seedData, autoSeedIfNeeded };
