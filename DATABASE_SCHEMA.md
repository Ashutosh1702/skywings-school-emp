# SkyWings School ERP — Complete Database Schema & Data Dictionary

This document provides the complete MongoDB database schema specification for all modules present in the **SkyWings School ERP** system.

**Database Name:** `skywings_erp`  
**Connection URI:** `mongodb://localhost:27017/skywings_erp`  
**Object Document Mapper (ODM):** Mongoose (Node.js)

---

## 1. Entity-Relationship Architecture

```
                  ┌─────────────────┐
                  │ AcademicSession │
                  └────────┬────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Class     │◄───┤   Student    ├───►│    Parent    │
└──────┬───────┘    └──────┬───────┘    └──────────────┘
       │                   │
       ▼                   ├───────────────────┬───────────────────┐
┌──────────────┐           ▼                   ▼                   ▼
│   Section    │    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
└──────┬───────┘    │  Attendance  │    │  StudentFee  │    │     Mark     │
       │            └──────────────┘    └──────┬───────┘    └──────────────┘
       ▼                                       ▼
┌──────────────┐                        ┌──────────────┐
│  Timetable   │◄───[ Teacher ]         │   Payment    │
└──────────────┘                        └──────────────┘
```

---

## 2. Complete Module Schema Matrix

| # | Sidebar Module | Mongoose Model | MongoDB Collection | Model File |
| :- | :--- | :--- | :--- | :--- |
| **01** | **Users & Roles** | `User` | `users` | [User.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/User.js) |
| **02** | **School Settings** | `School` | `schools` | [School.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/School.js) |
| **03** | **Academic Sessions** | `AcademicSession` | `academicsessions` | [AcademicSession.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/AcademicSession.js) |
| **04** | **Classes & Sections** | `Class`<br>`Section` | `classes`<br>`sections` | [Class.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Class.js)<br>[Section.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Section.js) |
| **05** | **Subjects** | `Subject` | `subjects` | [Subject.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Subject.js) |
| **06** | **Students (SIS)** | `Student` | `students` | [Student.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Student.js) |
| **07** | **Teachers & Staff** | `Teacher` | `teachers` | [Teacher.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Teacher.js) |
| **08** | **Parents** | `Parent` | `parents` | [Parent.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Parent.js) |
| **09** | **Attendance** | `Attendance` | `attendances` | [Attendance.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Attendance.js) |
| **10** | **Timetable** | `Timetable` | `timetables` | [Timetable.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Timetable.js) |
| **11** | **Fee Management** | `FeeHead`<br>`FeeStructure`<br>`StudentFee`<br>`Payment` | `feeheads`<br>`feestructures`<br>`studentfees`<br>`payments` | [FeeHead.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/FeeHead.js)<br>[FeeStructure.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/FeeStructure.js)<br>[StudentFee.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/StudentFee.js)<br>[Payment.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Payment.js) |
| **12** | **Exams & Results** | `Exam`<br>`Mark` | `exams`<br>`marks` | [Exam.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Exam.js)<br>[Mark.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Mark.js) |
| **13** | **Homework** | `Homework` | `homeworks` | [Homework.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Homework.js) |
| **14** | **Announcements** | `Announcement` | `announcements` | [Announcement.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Announcement.js) |
| **15** | **Library** | `Book`<br>`BookIssue` | `books`<br>`bookissues` | [Book.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/Book.js)<br>[BookIssue.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/BookIssue.js) |
| **16** | **Transport Fleet** | `TransportRoute` | `transportroutes` | [TransportRoute.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/TransportRoute.js) |
| **17** | **Audit Trail** | `AuditLog` | `auditlogs` | [AuditLog.js](file:///c:/Users/HP/Desktop/skywings-school-erp/server/src/models/AuditLog.js) |

---

## 3. Schema Definitions by Module

### 1. Attendance (`attendances`)
Tracks daily roll-call per student, class, section, and date.
```javascript
{
  student: { type: ObjectId, ref: 'Student', required: true },
  class: { type: ObjectId, ref: 'Class', required: true },
  section: { type: ObjectId, ref: 'Section', required: true },
  academicSession: { type: ObjectId, ref: 'AcademicSession', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half_day', 'leave'], 
    default: 'present' 
  },
  remarks: { type: String, default: '' },
  markedBy: { type: ObjectId, ref: 'User', required: true },
  timestamps: true
}
// Unique Index: Prevents duplicate attendance for the same student on the same date
// { student: 1, date: 1 } (unique: true)
```

---

### 2. Students SIS (`students`)
Stores comprehensive student master profiles.
```javascript
{
  user: { type: ObjectId, ref: 'User', default: null },
  admissionNumber: { type: String, required: true, unique: true, uppercase: true },
  rollNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'], 
    default: 'Unknown' 
  },
  photo: { type: String, default: '' },
  class: { type: ObjectId, ref: 'Class', required: true },
  section: { type: ObjectId, ref: 'Section', required: true },
  academicSession: { type: ObjectId, ref: 'AcademicSession', required: true },
  parent: { type: ObjectId, ref: 'Parent', default: null },
  email: { type: String, lowercase: true },
  phone: { type: String },
  address: { street: String, city: String, state: String, zipCode: String },
  admissionDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'transferred', 'graduated'], 
    default: 'active' 
  },
  timestamps: true
}
// Unique Index: { rollNumber: 1, class: 1, section: 1, academicSession: 1 }
```

---

### 3. Teachers & Staff (`teachers`)
Stores teacher details, employee IDs, department, and assigned classes.
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true, unique: true },
  employeeId: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  designation: { type: String, default: 'Teacher' },
  department: { type: String, default: 'General' },
  qualification: { type: String, default: '' },
  joiningDate: { type: Date, default: Date.now },
  subjects: [{ type: ObjectId, ref: 'Subject' }],
  assignedClasses: [
    {
      class: { type: ObjectId, ref: 'Class' },
      section: { type: ObjectId, ref: 'Section' }
    }
  ],
  status: { type: String, enum: ['active', 'inactive', 'on_leave'], default: 'active' },
  timestamps: true
}
```

---

### 4. Parents & Guardians (`parents`)
Stores parent profiles linked to their ward(s).
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true, unique: true },
  fatherName: { type: String, default: '' },
  motherName: { type: String, default: '' },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  occupation: { type: String, default: '' },
  address: { street: String, city: String, state: String, zipCode: String },
  children: [{ type: ObjectId, ref: 'Student' }],
  timestamps: true
}
```

---

### 5. Classes & Sections (`classes`, `sections`)
#### Class:
```javascript
{
  name: { type: String, required: true, unique: true }, // e.g. "Grade 10"
  numericGrade: { type: Number, required: true },       // e.g. 10
  sections: [{ type: ObjectId, ref: 'Section' }],
  timestamps: true
}
```
#### Section:
```javascript
{
  name: { type: String, required: true }, // "A", "B", etc.
  class: { type: ObjectId, ref: 'Class', required: true },
  roomNumber: { type: String, default: '' },
  capacity: { type: Number, default: 40 },
  classTeacher: { type: ObjectId, ref: 'Teacher', default: null },
  timestamps: true
}
// Unique Index: { class: 1, name: 1 }
```

---

### 6. Timetable (`timetables`)
Period slot scheduler with automated conflict clash detection.
```javascript
{
  class: { type: ObjectId, ref: 'Class', required: true },
  section: { type: ObjectId, ref: 'Section', required: true },
  academicSession: { type: ObjectId, ref: 'AcademicSession', required: true },
  dayOfWeek: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
    required: true 
  },
  periodNumber: { type: Number, required: true }, // 1-8
  startTime: { type: String, required: true },    // e.g. "08:30"
  endTime: { type: String, required: true },      // e.g. "09:15"
  subject: { type: ObjectId, ref: 'Subject', required: true },
  teacher: { type: ObjectId, ref: 'Teacher', required: true },
  roomNumber: { type: String, default: '101' },
  timestamps: true
}
// Conflict Prevention Indexes:
// 1. Class-Section Slot Clash: { class: 1, section: 1, academicSession: 1, dayOfWeek: 1, periodNumber: 1 } (unique)
// 2. Teacher Multi-Booking Clash: { teacher: 1, academicSession: 1, dayOfWeek: 1, periodNumber: 1 } (unique)
```

---

### 7. Fee Management (`feeheads`, `feestructures`, `studentfees`, `payments`)
#### FeeHead (`feeheads`):
```javascript
{
  name: { type: String, required: true }, // "Tuition Fee", "Lab Fee"
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, default: '' },
  timestamps: true
}
```
#### FeeStructure (`feestructures`):
```javascript
{
  name: { type: String, required: true },
  academicSession: { type: ObjectId, ref: 'AcademicSession', required: true },
  class: { type: ObjectId, ref: 'Class', required: true },
  frequency: { type: String, enum: ['monthly', 'quarterly', 'annual'], default: 'quarterly' },
  breakdown: [
    {
      feeHead: { type: ObjectId, ref: 'FeeHead', required: true },
      amount: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  installments: [
    {
      installmentNumber: Number,
      name: String,
      dueDate: Date,
      amount: Number
    }
  ],
  timestamps: true
}
```
#### StudentFee (`studentfees`) & Payment (`payments`):
```javascript
// StudentFee: Ledger per student
{
  student: { type: ObjectId, ref: 'Student', required: true },
  academicSession: { type: ObjectId, ref: 'AcademicSession', required: true },
  feeStructure: { type: ObjectId, ref: 'FeeStructure', required: true },
  grossTotal: Number,
  concessionAmount: { type: Number, default: 0 },
  netPayable: Number,
  totalPaid: { type: Number, default: 0 },
  balance: Number,
  overallStatus: { type: String, enum: ['paid', 'partial', 'due', 'overdue'], default: 'due' },
  installments: [{ ... }],
  timestamps: true
}

// Payment: Transaction receipts
{
  receiptNumber: { type: String, required: true, unique: true },
  student: { type: ObjectId, ref: 'Student', required: true },
  studentFee: { type: ObjectId, ref: 'StudentFee', required: true },
  installmentNumber: Number,
  amountPaid: { type: Number, required: true },
  remainingBalance: Number,
  paymentMethod: { type: String, enum: ['cash', 'cheque', 'bank_transfer', 'upi', 'online', 'card'] },
  transactionId: String,
  collectedBy: { type: ObjectId, ref: 'User' },
  timestamps: true
}
```

---

### 8. Exams & Marks (`exams`, `marks`)
```javascript
// Exam:
{
  name: { type: String, required: true },
  examType: { type: String, enum: ['unit_test', 'mid_term', 'final', 'quarterly'], default: 'mid_term' },
  academicSession: { type: ObjectId, ref: 'AcademicSession', required: true },
  class: { type: ObjectId, ref: 'Class', required: true },
  startDate: Date,
  endDate: Date,
  subjects: [
    {
      subject: { type: ObjectId, ref: 'Subject' },
      examDate: Date,
      startTime: String,
      endTime: String,
      maxMarks: Number,
      passingMarks: Number
    }
  ],
  status: { type: String, enum: ['scheduled', 'in_progress', 'completed', 'results_published'] }
}

// Mark:
{
  exam: { type: ObjectId, ref: 'Exam', required: true },
  student: { type: ObjectId, ref: 'Student', required: true },
  class: { type: ObjectId, ref: 'Class', required: true },
  section: { type: ObjectId, ref: 'Section', required: true },
  subject: { type: ObjectId, ref: 'Subject', required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
  percentage: Number,
  grade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'] },
  remarks: String,
  evaluatedBy: { type: ObjectId, ref: 'Teacher' }
}
// Unique Index: { exam: 1, student: 1, subject: 1 }
```

---

### 9. Homework (`homeworks`) & Announcements (`announcements`)
```javascript
// Homework:
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  class: { type: ObjectId, ref: 'Class', required: true },
  section: { type: ObjectId, ref: 'Section', required: true },
  subject: { type: ObjectId, ref: 'Subject', required: true },
  assignedBy: { type: ObjectId, ref: 'Teacher', required: true },
  assignedDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' }
}

// Announcement:
{
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetAudience: [{ type: String, enum: ['all', 'teachers', 'parents', 'students'] }],
  priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
  author: { type: ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' }
}
```

---

### 10. Library (`books`, `bookissues`)
```javascript
// Book:
{
  isbn: { type: String, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, default: 'General' },
  rackNumber: String,
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 }
}

// BookIssue:
{
  book: { type: ObjectId, ref: 'Book', required: true },
  student: { type: ObjectId, ref: 'Student', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: Date,
  fineAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' },
  issuedBy: { type: ObjectId, ref: 'User', required: true }
}
```

---

### 11. Transport (`transportroutes`) & Audit Log (`auditlogs`)
```javascript
// TransportRoute:
{
  routeName: { type: String, required: true },
  vehicleNumber: { type: String, required: true, uppercase: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  vehicleCapacity: { type: Number, default: 40 },
  stops: [
    {
      stopName: { type: String, required: true },
      pickupTime: String,
      dropTime: String,
      monthlyFee: Number
    }
  ]
}

// AuditLog: Immutable security log
{
  userId: { type: ObjectId, ref: 'User' },
  action: { type: String, required: true }, // e.g. 'MARK_ATTENDANCE', 'RECORD_PAYMENT'
  entity: { type: String, required: true }, // e.g. 'Attendance', 'Student'
  entityId: { type: ObjectId },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
}
```

