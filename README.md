# SkyWings School ERP — Full-Stack MERN Enterprise Application

**Client / Organization:** Skywings Nextgen Tech Pvt. Ltd.  
**System:** Comprehensive School Enterprise Resource Planning (ERP) System  
**Stack:** MongoDB, Express.js, React.js, Node.js (MERN) + Tailwind CSS + Vite  

---

## 1. Project Overview & Module Matrix

**SkyWings School ERP** is a full-featured, multi-tenant capable, production-oriented School Management System developed for **Skywings Nextgen Tech Pvt. Ltd.** It unifies all critical academic, administrative, and financial functions of a modern educational institution into a single, cohesive, secure, and responsive web platform.

### Module Implementation Coverage:

| # | Module | Scope | Status | Source Files |
| :- | :--- | :--- | :-: | :--- |
| **01** | **Role-Specific Dashboards** | KPIs, Recharts fee chart, attendance rates, audit logs, student/teacher cards | **100% COMPLETE** | `Dashboard.jsx`, `dashboardController.js` |
| **02** | **School Setup & Master Data** | School profile, affiliation, academic sessions, grade levels, sections, subjects | **100% COMPLETE** | `School.js`, `AcademicSession.js`, `Class.js`, `Section.js` |
| **03** | **Student Management (SIS)** | Unique admission numbers, roll uniqueness, profile views, filters, status toggles | **100% COMPLETE** | `StudentsView.jsx`, `Student.js`, `studentController.js` |
| **04** | **Parent Management** | Guardian profiles, child linking, child-wise permission isolation | **100% COMPLETE** | `ParentsView.jsx`, `Parent.js`, `parentController.js` |
| **05** | **Teacher & Staff Management** | Faculty profiles, employee IDs, department assignments, portal logins | **100% COMPLETE** | `TeachersView.jsx`, `Teacher.js`, `teacherController.js` |
| **06** | **Class, Section & Timetable** | Period schedule matrix with automated clash detection for teachers/rooms | **100% COMPLETE** | `TimetableView.jsx`, `Timetable.js`, `timetableController.js` |
| **07** | **Attendance Management** | Daily class roll-call, bulk write, date conflict checks, summary analytics | **100% COMPLETE** | `AttendanceView.jsx`, `Attendance.js`, `attendanceController.js` |
| **08** | **Fee Management & Payments** | Fee heads, class fee structures, installments, receipts, concessions, balance | **100% COMPLETE** | `FeesView.jsx`, `FeeStructure.js`, `Payment.js`, `paymentController.js` |
| **09** | **Exams & Results** | Exam creation, subject marks entry, automated percentage, grading (`A+`-`F`) | **100% COMPLETE** | `ExamsView.jsx`, `Exam.js`, `Mark.js`, `examController.js` |
| **10** | **Homework & Assignments** | Class/section homework assignments, due dates, instructions, parent visibility | **100% COMPLETE** | `HomeworkView.jsx`, `Homework.js`, `homeworkController.js` |
| **11** | **Communication & Notices** | School circulars, targeted audiences (All, Teachers, Parents), priority badges | **100% COMPLETE** | `AnnouncementsView.jsx`, `Announcement.js`, `announcementController.js` |
| **12** | **Reports & Analytics** | Student directories, fee collection audits, pending dues, dynamic CSV export | **100% COMPLETE** | `ReportsView.jsx`, `reportController.js` |
| **13** | **User, Role & Permissions** | Account activation/deactivation, role filters, admin password reset workflow | **100% COMPLETE** | `UsersView.jsx`, `User.js`, `userController.js`, `authMiddleware.js` |
| **14** | **Audit & Activity Log** | Immutable trail of critical actions, sanitized payloads (no passwords/tokens) | **100% COMPLETE** | `AuditLogsView.jsx`, `AuditLog.js`, `auditLogger.js`, `auditController.js` |
| **15** | **Library Management** | Books catalogue, stock tracking, student checkout/return, overdue fine calc | **100% COMPLETE** | `LibraryView.jsx`, `Book.js`, `BookIssue.js`, `libraryController.js` |
| **16** | **Transport Management** | Fleet routes, vehicle plates, driver contacts, boarding stops with pickup/drop | **100% COMPLETE** | `TransportView.jsx`, `TransportRoute.js`, `transportController.js` |

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js (v19) via Vite
- **Styling**: Tailwind CSS (v4) with enterprise SaaS blue/navy palette
- **Routing**: Single-Page Application (SPA) with role-aware tab navigation
- **Data Visualization**: Recharts (Financial analytics, fee collection bars)
- **State & Context**: React Context API (`AuthContext`, `ToastContext`)
- **API Client**: Fetch/Axios REST integration (`services/api.js`)

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with Bearer headers & HTTP-only cookies
- **Password Security**: bcrypt password hashing with salt rounds
- **Logging**: Morgan HTTP logger & custom MongoDB AuditLog collection
- **CORS & Middleware**: Configured for cross-origin security and credentials

---

## 3. Monorepo Directory Architecture

```
skywings-school-erp/
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── ui/
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── Select.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── Login.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── attendance/AttendanceView.jsx
│   │   │       ├── announcements/AnnouncementsView.jsx
│   │   │       ├── audit/AuditLogsView.jsx
│   │   │       ├── classes/ClassesView.jsx
│   │   │       ├── exams/ExamsView.jsx
│   │   │       ├── fees/FeesView.jsx
│   │   │       ├── homework/HomeworkView.jsx
│   │   │       ├── library/LibraryView.jsx
│   │   │       ├── parents/ParentsView.jsx
│   │   │       ├── reports/ReportsView.jsx
│   │   │       ├── students/StudentsView.jsx
│   │   │       ├── teachers/TeachersView.jsx
│   │   │       ├── timetable/TimetableView.jsx
│   │   │       ├── transport/TransportView.jsx
│   │   │       └── users/UsersView.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── announcementController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── auditController.js
│   │   │   ├── authController.js
│   │   │   ├── classController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── examController.js
│   │   │   ├── feeController.js
│   │   │   ├── homeworkController.js
│   │   │   ├── libraryController.js
│   │   │   ├── parentController.js
│   │   │   ├── paymentController.js
│   │   │   ├── reportController.js
│   │   │   ├── schoolController.js
│   │   │   ├── studentController.js
│   │   │   ├── subjectController.js
│   │   │   ├── teacherController.js
│   │   │   ├── timetableController.js
│   │   │   ├── transportController.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── AcademicSession.js
│   │   │   ├── Announcement.js
│   │   │   ├── Attendance.js
│   │   │   ├── AuditLog.js
│   │   │   ├── Book.js
│   │   │   ├── BookIssue.js
│   │   │   ├── Class.js
│   │   │   ├── Exam.js
│   │   │   ├── FeeHead.js
│   │   │   ├── FeeStructure.js
│   │   │   ├── Homework.js
│   │   │   ├── Mark.js
│   │   │   ├── Parent.js
│   │   │   ├── Payment.js
│   │   │   ├── School.js
│   │   │   ├── Section.js
│   │   │   ├── Student.js
│   │   │   ├── StudentFee.js
│   │   │   ├── Subject.js
│   │   │   ├── Teacher.js
│   │   │   ├── Timetable.js
│   │   │   ├── TransportRoute.js
│   │   │   └── User.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── announcementRoutes.js
│   │   │   ├── attendanceRoutes.js
│   │   │   ├── auditRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── classRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── examRoutes.js
│   │   │   ├── feeRoutes.js
│   │   │   ├── homeworkRoutes.js
│   │   │   ├── libraryRoutes.js
│   │   │   ├── parentRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── schoolRoutes.js
│   │   │   ├── studentRoutes.js
│   │   │   ├── subjectRoutes.js
│   │   │   ├── teacherRoutes.js
│   │   │   ├── timetableRoutes.js
│   │   │   ├── transportRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── utils/
│   │   │   ├── auditLogger.js
│   │   │   └── seeder.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── TESTING.md
```

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB installed locally on `mongodb://localhost:27017` or a MongoDB Atlas URI

### Step 1: Clone or Navigate to the Workspace
```bash
cd c:\Users\HP\Desktop\skywings-school-erp
```

### Step 2: Install Server Dependencies & Seed Database
```bash
cd server
npm install
npm run seed     # Seeds realistic dummy data for testing personas & all 16 modules
npm run dev      # Starts Express server on port 5000
```

### Step 3: Install Client Dependencies & Launch
In a new terminal window:
```bash
cd client
npm install
npm run dev      # Starts Vite React development server on port 5173
```

Open your browser at `http://localhost:5173`.

---

## 5. Demo Accounts & Personas

The database seeder pre-configures test personas with real operational data:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin / Principal** | `admin@skywings.com` | `Admin@123` | Full ERP configuration, admissions, staff, fees, reports |
| **Senior Teacher** | `teacher@skywings.com` | `Teacher@123` | Assigned classes, daily attendance, exam marks entry |
| **Parent / Guardian** | `parent@skywings.com` | `Parent@123` | Linked ward profile, attendance tracking, fee receipts |

*Note: The login screen contains one-click persona selector buttons for rapid testing.*
