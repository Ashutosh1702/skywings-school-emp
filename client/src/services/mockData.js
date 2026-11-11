// Complete Realistic Mock Data for SkyWings School ERP
// Used as seamless fallback when backend server (port 5000) is offline or starting up

export const mockClasses = [
  {
    _id: 'cls-10',
    name: 'Grade 10',
    numericGrade: 10,
    sections: [
      { _id: 'sec-10a', name: 'A', roomNumber: 'Room 301', capacity: 40 },
      { _id: 'sec-10b', name: 'B', roomNumber: 'Room 302', capacity: 40 },
    ],
  },
  {
    _id: 'cls-9',
    name: 'Grade 9',
    numericGrade: 9,
    sections: [
      { _id: 'sec-9a', name: 'A', roomNumber: 'Room 201', capacity: 40 },
    ],
  },
  {
    _id: 'cls-8',
    name: 'Grade 8',
    numericGrade: 8,
    sections: [
      { _id: 'sec-8a', name: 'A', roomNumber: 'Room 101', capacity: 35 },
    ],
  },
];

export const mockSubjects = [
  { _id: 'sub-math', name: 'Mathematics', code: 'MATH10', type: 'theory', classes: ['cls-10', 'cls-9'] },
  { _id: 'sub-sci', name: 'Science & Technology', code: 'SCI10', type: 'both', classes: ['cls-10', 'cls-9'] },
  { _id: 'sub-eng', name: 'English Language & Lit', code: 'ENG10', type: 'theory', classes: ['cls-10', 'cls-9'] },
  { _id: 'sub-soc', name: 'Social Studies', code: 'SOC10', type: 'theory', classes: ['cls-10', 'cls-9'] },
  { _id: 'sub-cs', name: 'Computer Applications', code: 'CS10', type: 'practical', classes: ['cls-10', 'cls-9'] },
];

export const mockTeachers = [
  {
    _id: 'tch-1',
    employeeId: 'EMP-T-101',
    name: 'Priya Mukherjee',
    email: 'teacher@skywings.com',
    phone: '+91 98450 12345',
    designation: 'Senior PGT Mathematics',
    department: 'Mathematics',
    qualification: 'M.Sc, M.Ed',
    status: 'active',
    assignedClasses: [
      { class: { _id: 'cls-10', name: 'Grade 10' }, section: { _id: 'sec-10a', name: 'A' } },
    ],
    subjects: [{ _id: 'sub-math', name: 'Mathematics', code: 'MATH10' }],
  },
  {
    _id: 'tch-2',
    employeeId: 'EMP-T-102',
    name: 'Dr. Anand Verma',
    email: 'anand.verma@skywings.com',
    phone: '+91 98450 67890',
    designation: 'PGT Physics & Science',
    department: 'Science',
    qualification: 'Ph.D Physics',
    status: 'active',
    assignedClasses: [
      { class: { _id: 'cls-10', name: 'Grade 10' }, section: { _id: 'sec-10a', name: 'A' } },
    ],
    subjects: [{ _id: 'sub-sci', name: 'Science & Technology', code: 'SCI10' }],
  },
  {
    _id: 'tch-3',
    employeeId: 'EMP-T-103',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi@skywings.com',
    phone: '+91 98450 54321',
    designation: 'TGT English Literature',
    department: 'English',
    qualification: 'M.A. English, B.Ed',
    status: 'active',
    assignedClasses: [
      { class: { _id: 'cls-9', name: 'Grade 9' }, section: { _id: 'sec-9a', name: 'A' } },
    ],
    subjects: [{ _id: 'sub-eng', name: 'English Language & Lit', code: 'ENG10' }],
  },
];

export const mockParents = [
  {
    _id: 'par-1',
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
    children: [
      {
        _id: 'std-1',
        firstName: 'Aarav',
        lastName: 'Roy',
        admissionNumber: 'ADM-2026-001',
        rollNumber: '101',
        class: { _id: 'cls-10', name: 'Grade 10' },
        section: { _id: 'sec-10a', name: 'A' },
      },
    ],
  },
  {
    _id: 'par-2',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 98888 11111',
    occupation: 'Architect',
    address: { street: '12 Green Avenue', city: 'Bangalore', state: 'Karnataka', zipCode: '560034' },
    children: [
      {
        _id: 'std-2',
        firstName: 'Diya',
        lastName: 'Sharma',
        admissionNumber: 'ADM-2026-002',
        rollNumber: '102',
        class: { _id: 'cls-10', name: 'Grade 10' },
        section: { _id: 'sec-10a', name: 'A' },
      },
    ],
  },
];

export const mockStudents = [
  {
    _id: 'std-1',
    admissionNumber: 'ADM-2026-001',
    rollNumber: '101',
    firstName: 'Aarav',
    lastName: 'Roy',
    gender: 'male',
    dateOfBirth: '2011-05-14',
    bloodGroup: 'B+',
    status: 'active',
    email: 'aarav.roy@student.skywings.com',
    phone: '+91 97410 98765',
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10a', name: 'A' },
    parent: {
      _id: 'par-1',
      fatherName: 'Vikramaditya Roy',
      phone: '+91 97410 98765',
      email: 'parent@skywings.com',
    },
    attendanceRate: 96.5,
    feeStatus: 'paid',
  },
  {
    _id: 'std-2',
    admissionNumber: 'ADM-2026-002',
    rollNumber: '102',
    firstName: 'Diya',
    lastName: 'Sharma',
    gender: 'female',
    dateOfBirth: '2011-08-22',
    bloodGroup: 'O+',
    status: 'active',
    email: 'diya.sharma@student.skywings.com',
    phone: '+91 98888 11111',
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10a', name: 'A' },
    parent: {
      _id: 'par-2',
      fatherName: 'Rajesh Sharma',
      phone: '+91 98888 11111',
      email: 'rajesh.sharma@gmail.com',
    },
    attendanceRate: 98.2,
    feeStatus: 'pending',
  },
  {
    _id: 'std-3',
    admissionNumber: 'ADM-2026-003',
    rollNumber: '103',
    firstName: 'Rohan',
    lastName: 'Gupta',
    gender: 'male',
    dateOfBirth: '2011-03-10',
    bloodGroup: 'A+',
    status: 'active',
    email: 'rohan.gupta@student.skywings.com',
    phone: '+91 98777 22222',
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10b', name: 'B' },
    attendanceRate: 92.1,
    feeStatus: 'paid',
  },
  {
    _id: 'std-4',
    admissionNumber: 'ADM-2026-004',
    rollNumber: '104',
    firstName: 'Ananya',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '2011-11-30',
    bloodGroup: 'AB+',
    status: 'active',
    email: 'ananya.patel@student.skywings.com',
    phone: '+91 98666 33333',
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10b', name: 'B' },
    attendanceRate: 95.0,
    feeStatus: 'paid',
  },
  {
    _id: 'std-5',
    admissionNumber: 'ADM-2026-005',
    rollNumber: '105',
    firstName: 'Siddharth',
    lastName: 'Reddy',
    gender: 'male',
    dateOfBirth: '2012-04-18',
    bloodGroup: 'O-',
    status: 'active',
    email: 'siddharth.reddy@student.skywings.com',
    phone: '+91 98555 44444',
    class: { _id: 'cls-9', name: 'Grade 9' },
    section: { _id: 'sec-9a', name: 'A' },
    attendanceRate: 94.3,
    feeStatus: 'paid',
  },
  {
    _id: 'std-6',
    admissionNumber: 'ADM-2026-006',
    rollNumber: '106',
    firstName: 'Tanvi',
    lastName: 'Mehta',
    gender: 'female',
    dateOfBirth: '2012-07-25',
    bloodGroup: 'B-',
    status: 'active',
    email: 'tanvi.mehta@student.skywings.com',
    phone: '+91 98444 55555',
    class: { _id: 'cls-9', name: 'Grade 9' },
    section: { _id: 'sec-9a', name: 'A' },
    attendanceRate: 97.4,
    feeStatus: 'pending',
  },
];

export const mockFeeHeads = [
  { _id: 'fh-1', name: 'Tuition Fee', code: 'TUITION', description: 'Academic Instruction Term Fee' },
  { _id: 'fh-2', name: 'Science & Computer Lab Fee', code: 'LAB', description: 'Laboratories & Equipment' },
  { _id: 'fh-3', name: 'Sports & Cultural Activities', code: 'SPORTS', description: 'Clubs and Athletics' },
  { _id: 'fh-4', name: 'Campus Transport Facility', code: 'TRANS', description: 'School Bus Commute' },
];

export const mockFeeStructures = [
  {
    _id: 'fs-1',
    name: 'Grade 10 Annual Comprehensive 2026-27',
    frequency: 'quarterly',
    totalAmount: 80000,
    class: { _id: 'cls-10', name: 'Grade 10' },
    breakdown: [
      { feeHead: { _id: 'fh-1', name: 'Tuition Fee' }, amount: 60000 },
      { feeHead: { _id: 'fh-2', name: 'Science & Lab Fee' }, amount: 15000 },
      { feeHead: { _id: 'fh-3', name: 'Sports Fee' }, amount: 5000 },
    ],
  },
  {
    _id: 'fs-2',
    name: 'Grade 9 Standard Academic 2026-27',
    frequency: 'quarterly',
    totalAmount: 72000,
    class: { _id: 'cls-9', name: 'Grade 9' },
    breakdown: [
      { feeHead: { _id: 'fh-1', name: 'Tuition Fee' }, amount: 55000 },
      { feeHead: { _id: 'fh-2', name: 'Science & Lab Fee' }, amount: 12000 },
      { feeHead: { _id: 'fh-3', name: 'Sports Fee' }, amount: 5000 },
    ],
  },
];

export const mockPayments = [
  {
    _id: 'pay-1',
    receiptNumber: 'RCP-2026-00891',
    paymentDate: '2026-04-10',
    amount: 20000,
    amountPaid: 20000,
    remainingBalance: 60000,
    paymentMethod: 'UPI',
    transactionId: 'UPI-9874512398',
    status: 'completed',
    student: {
      _id: 'std-1',
      firstName: 'Aarav',
      lastName: 'Roy',
      admissionNumber: 'ADM-2026-001',
      class: { name: 'Grade 10' },
    },
  },
  {
    _id: 'pay-2',
    receiptNumber: 'RCP-2026-00892',
    paymentDate: '2026-04-12',
    amount: 20000,
    amountPaid: 20000,
    remainingBalance: 60000,
    paymentMethod: 'Net Banking',
    transactionId: 'HDFC-883719401',
    status: 'completed',
    student: {
      _id: 'std-3',
      firstName: 'Rohan',
      lastName: 'Gupta',
      admissionNumber: 'ADM-2026-003',
      class: { name: 'Grade 10' },
    },
  },
  {
    _id: 'pay-3',
    receiptNumber: 'RCP-2026-00893',
    paymentDate: '2026-04-14',
    amount: 18000,
    amountPaid: 18000,
    remainingBalance: 54000,
    paymentMethod: 'Card',
    transactionId: 'TXN-773829104',
    status: 'completed',
    student: {
      _id: 'std-5',
      firstName: 'Siddharth',
      lastName: 'Reddy',
      admissionNumber: 'ADM-2026-005',
      class: { name: 'Grade 9' },
    },
  },
];

export const mockExams = [
  {
    _id: 'ex-1',
    name: 'Mid-Term Examination 2026',
    class: { _id: 'cls-10', name: 'Grade 10' },
    startDate: '2026-09-15',
    endDate: '2026-09-26',
    status: 'upcoming',
    schedule: [
      { subject: { _id: 'sub-math', name: 'Mathematics' }, examDate: '2026-09-15', maxMarks: 100, passMarks: 35 },
      { subject: { _id: 'sub-sci', name: 'Science & Technology' }, examDate: '2026-09-18', maxMarks: 100, passMarks: 35 },
      { subject: { _id: 'sub-eng', name: 'English Literature' }, examDate: '2026-09-22', maxMarks: 100, passMarks: 35 },
    ],
  },
  {
    _id: 'ex-2',
    name: 'Unit Assessment 1',
    class: { _id: 'cls-9', name: 'Grade 9' },
    startDate: '2026-07-10',
    endDate: '2026-07-15',
    status: 'completed',
    schedule: [
      { subject: { _id: 'sub-math', name: 'Mathematics' }, examDate: '2026-07-10', maxMarks: 50, passMarks: 18 },
    ],
  },
];

export const mockTimetable = [
  {
    _id: 'tt-1',
    dayOfWeek: 'Monday',
    periodNumber: 1,
    startTime: '08:30',
    endTime: '09:15',
    roomNumber: 'Room 301',
    subject: { _id: 'sub-math', name: 'Mathematics' },
    teacher: { _id: 'tch-1', name: 'Priya Mukherjee' },
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10a', name: 'A' },
  },
  {
    _id: 'tt-2',
    dayOfWeek: 'Monday',
    periodNumber: 2,
    startTime: '09:15',
    endTime: '10:00',
    roomNumber: 'Science Lab 2',
    subject: { _id: 'sub-sci', name: 'Science & Technology' },
    teacher: { _id: 'tch-2', name: 'Dr. Anand Verma' },
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10a', name: 'A' },
  },
  {
    _id: 'tt-3',
    dayOfWeek: 'Monday',
    periodNumber: 3,
    startTime: '10:15',
    endTime: '11:00',
    roomNumber: 'Room 301',
    subject: { _id: 'sub-eng', name: 'English Language & Lit' },
    teacher: { _id: 'tch-3', name: 'Meenakshi Sundaram' },
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10a', name: 'A' },
  },
];

export const mockHomework = [
  {
    _id: 'hw-1',
    title: 'Quadratic Equations Exercise 4.2',
    description: 'Solve questions 1 through 10 from NCERT Textbook Page 87.',
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10a', name: 'A' },
    subject: { _id: 'sub-math', name: 'Mathematics' },
    assignedDate: '2026-05-10',
    dueDate: '2026-05-15',
  },
  {
    _id: 'hw-2',
    title: 'Light Reflection and Refraction Diagrams',
    description: 'Draw ray diagrams for concave and convex mirrors in the practical record book.',
    class: { _id: 'cls-10', name: 'Grade 10' },
    section: { _id: 'sec-10a', name: 'A' },
    subject: { _id: 'sub-sci', name: 'Science & Technology' },
    assignedDate: '2026-05-11',
    dueDate: '2026-05-16',
  },
];

export const mockAnnouncements = [
  {
    _id: 'ann-1',
    title: 'Annual Inter-School Science & Robotics Fair 2026',
    message:
      'We are pleased to invite students from Grades 8 to 12 to submit their project abstracts for the upcoming SkyWings Science Exhibition.',
    content:
      'We are pleased to invite students from Grades 8 to 12 to submit their project abstracts for the upcoming SkyWings Science Exhibition.',
    targetAudience: ['all'],
    priority: 'urgent',
    isUrgent: true,
    createdAt: '2026-05-01T09:00:00.000Z',
    publishDate: '2026-05-01',
    author: { name: 'Principal Office' },
  },
  {
    _id: 'ann-2',
    title: 'Quarterly Parent-Teacher Meeting (PTM) Schedule',
    message:
      'The Term 1 Parent-Teacher interaction will take place this Saturday, May 17, from 9:00 AM to 1:00 PM. Parents are requested to adhere to their time slots.',
    content:
      'The Term 1 Parent-Teacher interaction will take place this Saturday, May 17, from 9:00 AM to 1:00 PM. Parents are requested to adhere to their time slots.',
    targetAudience: ['parents'],
    priority: 'important',
    isUrgent: false,
    createdAt: '2026-05-08T10:30:00.000Z',
    publishDate: '2026-05-08',
    author: { name: 'Academic Coordinator' },
  },
  {
    _id: 'ann-3',
    title: 'Campus Green Initiative & Plastic-Free Week',
    message: 'All classrooms are encouraged to participate in eco-friendly recycling drives this week.',
    content: 'All classrooms are encouraged to participate in eco-friendly recycling drives this week.',
    targetAudience: ['all'],
    priority: 'normal',
    isUrgent: false,
    createdAt: '2026-05-05T11:00:00.000Z',
    publishDate: '2026-05-05',
    author: { name: 'Environment Club' },
  },
];

export const mockBooks = [
  {
    _id: 'bk-1',
    title: 'NCERT Mathematics for Class X',
    isbn: '978-81-7450-634-4',
    author: 'NCERT Editorial Board',
    category: 'Mathematics',
    totalCopies: 25,
    availableCopies: 21,
    shelfLocation: 'Shelf A-4',
  },
  {
    _id: 'bk-2',
    title: 'Concepts of Physics (Part 1 & 2)',
    isbn: '978-81-7709-187-8',
    author: 'Prof. H.C. Verma',
    category: 'Science',
    totalCopies: 15,
    availableCopies: 11,
    shelfLocation: 'Shelf S-2',
  },
  {
    _id: 'bk-3',
    title: 'Wings of Fire: An Autobiography',
    isbn: '978-81-7371-146-6',
    author: 'Dr. A.P.J. Abdul Kalam',
    category: 'Biography',
    totalCopies: 10,
    availableCopies: 8,
    shelfLocation: 'Shelf B-1',
  },
];

export const mockTransportRoutes = [
  {
    _id: 'tr-1',
    routeName: 'Route 1: Whitefield & Kadugodi Express',
    vehicleNumber: 'KA-01-F-1234',
    driverName: 'Manjunath Gowda',
    driverPhone: '+91 98451 99991',
    capacity: 45,
    stops: [
      { stopName: 'Hope Farm Circle', pickupTime: '07:15', dropTime: '15:45' },
      { stopName: 'ITPL Main Gate', pickupTime: '07:30', dropTime: '15:30' },
      { stopName: 'Hoodi Junction', pickupTime: '07:45', dropTime: '15:15' },
      { stopName: 'SkyWings Campus', pickupTime: '08:15', dropTime: '14:45' },
    ],
  },
  {
    _id: 'tr-2',
    routeName: 'Route 2: Indiranagar & Domlur Feeder',
    vehicleNumber: 'KA-01-F-5678',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98451 88882',
    capacity: 40,
    stops: [
      { stopName: '100 Feet Road Metro', pickupTime: '07:10', dropTime: '15:50' },
      { stopName: 'Domlur Flyover', pickupTime: '07:25', dropTime: '15:35' },
      { stopName: 'Marathahalli Bridge', pickupTime: '07:45', dropTime: '15:15' },
      { stopName: 'SkyWings Campus', pickupTime: '08:15', dropTime: '14:45' },
    ],
  },
];

export const mockAuditLogs = [
  { _id: 'aud-1', action: 'USER_LOGIN', entity: 'Auth', createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { _id: 'aud-2', action: 'STUDENT_ENROLLED', entity: 'Student', createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString() },
  { _id: 'aud-3', action: 'FEE_PAYMENT_RECORDED', entity: 'Payment', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { _id: 'aud-4', action: 'ATTENDANCE_BATCH_SAVED', entity: 'Attendance', createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  { _id: 'aud-5', action: 'CIRCULAR_PUBLISHED', entity: 'Announcement', createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
];

export const mockUsers = [
  {
    _id: 'u-1',
    name: 'Dr. Rajesh Sharma (Principal)',
    email: 'admin@skywings.com',
    role: 'admin',
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    _id: 'u-2',
    name: 'Priya Mukherjee',
    email: 'teacher@skywings.com',
    role: 'teacher',
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    _id: 'u-3',
    name: 'Vikramaditya Roy',
    email: 'parent@skywings.com',
    role: 'parent',
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
];

export const mockSchoolProfile = {
  name: 'Skywings International Academy',
  code: 'SKYWINGS-001',
  affiliationNumber: 'CBSE-2026-9874',
  email: 'admin@skywingsschool.com',
  phone: '+91 98765 43210',
  website: 'https://skywingsschool.com',
  address: {
    street: 'Plot No. 42, Tech Park Enclave',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    country: 'India',
  },
};

export const mockAcademicSessions = [
  { _id: 'ses-1', name: '2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', isCurrent: true, status: 'active' },
  { _id: 'ses-2', name: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', isCurrent: false, status: 'completed' },
];

export const mockDashboardData = {
  admin: {
    totalStudents: 1250,
    totalTeachers: 68,
    totalStaff: 24,
    totalClasses: 14,
    attendanceRate: 96.5,
    todayPresent: 1206,
    todayAbsent: 44,
    totalCollected: 8450000,
    pendingFees: 1240000,
    upcomingExams: mockExams,
    recentActivities: mockAuditLogs,
    monthlyFeeData: [
      { month: 'Jan', collected: 720000 },
      { month: 'Feb', collected: 810000 },
      { month: 'Mar', collected: 950000 },
      { month: 'Apr', collected: 1420000 },
      { month: 'May', collected: 1100000 },
      { month: 'Jun', collected: 890000 },
    ],
  },
  teacher: {
    teacher: mockTeachers[0],
    todayTimetable: mockTimetable,
    activeHomework: mockHomework,
  },
  parent: {
    children: mockParents[0].children,
  },
};
