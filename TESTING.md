# SkyWings School ERP — Acceptance Testing & Quality Assurance Document

**Client:** Skywings Nextgen Tech Pvt. Ltd.  
**System:** SkyWings School Management System (ERP)  
**Standard:** Intern Development Handover Acceptance Criteria  

---

## 1. Acceptance Criteria Checklist

| Module | Acceptance Criteria | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Complete Routing** | React Router DOM v7, nested routes, role-based ProtectedRoute, NavLink active states, 404 handler. | **PASS** | Centralized in `AppRoutes.jsx`, wrapped in `BrowserRouter`. |
| **Auth & RBAC** | JWT authentication, bcrypt hash, role isolation (Admin, Teacher, Parent, Student). | **PASS** | Validated via `authMiddleware.js` & `ProtectedRoute.jsx`. |
| **Master Data** | Class & Section management, Academic Sessions, Subjects, Institutional Settings. | **PASS** | Managed via `SchoolSettingsView.jsx` & `ClassesView.jsx`. |
| **Student SIS** | Unique admission number & unique roll number within class/section/session. | **PASS** | Composite unique index in MongoDB schema. |
| **Teacher Module** | Unique employee ID, department, designation, portal user creation. | **PASS** | Enforced at controller and database level. |
| **Parent Module** | Linked children only, child-wise access control, data isolation. | **PASS** | HTTP 403 returned if parent queries unlinked child. |
| **Timetable** | Clash-detection preventing double-booking of teachers and rooms in same period. | **PASS** | Strict pre-validation query in `timetableController.js`. |
| **Attendance** | Daily class roll call, bulk write, date conflict prevention, real-time rate calc. | **PASS** | Unique compound index `{ student: 1, date: 1 }`. |
| **Fee Management** | Fee heads, class fee structures, installments, backend financial calculations. | **PASS** | Balance and totals computed strictly by server. |
| **Payment & Receipts** | Record payment, receipt generation (`REC-2026-XXXXX`), remaining balance recalc. | **PASS** | Installment allocated, status flips to `paid`. |
| **Exams & Results** | Exam creation, marks entry, automatic percentage & grade calculation, report card. | **PASS** | Grade scale `A+` through `F` calculated by server. |
| **Homework** | Class/section homework assignments, instructions, submission due dates. | **PASS** | Managed via `HomeworkView.jsx`. |
| **Announcements** | Target audience broadcasting (All, Teachers, Parents), priority badges. | **PASS** | Filtered by recipient role on fetch. |
| **Reports & Export** | Student master, fee collections, pending dues, dynamic CSV export. | **PASS** | Custom CSV formatting utility on client. |
| **Users & Permissions** | User accounts list, toggle active/inactive status, admin password reset. | **PASS** | Managed via `UsersView.jsx`. |
| **Audit Logs** | All critical operations logged with sanitized parameters. | **PASS** | Passwords and tokens scrubbed prior to writing. |
| **Library Management**| Book catalog, stock availability, book checkout/return with overdue fines. | **PASS** | Managed via `LibraryView.jsx`. |
| **Transport Fleet** | Bus routes, vehicle number, driver mapping, pickup/drop boarding stops. | **PASS** | Managed via `TransportView.jsx`. |

---

## 2. Test Execution Scenarios

### Scenario 1: Authorized User Workflow (Admin Admitting Student & Generating Ledger)
- **Role**: `admin@skywings.com`
- **Action**: Fill student admission form with Admission No `ADM-2026-003`, Roll No `103`, Class `Grade 10`, Section `A`.
- **Expected Result**: Student record created with HTTP 201; if a fee structure exists for Grade 10, a `StudentFee` ledger with installments is automatically generated.
- **Actual Result**: Student admitted successfully; fee ledger created with 4 quarterly installments totaling ₹80,000.
- **Outcome**: **PASSED**

### Scenario 2: Unauthorized Data Access (Parent Attempting to View Other Children)
- **Role**: `parent@skywings.com` (Linked only to `Aarav Roy`)
- **Action**: Send `GET /api/attendance/student/<unlinked_student_id>`.
- **Expected Result**: Backend rejects request with `403 Forbidden` (`Access denied. You can only view attendance for your linked children.`).
- **Actual Result**: Response HTTP 403 with error payload. Data remains protected.
- **Outcome**: **PASSED**

### Scenario 3: Protected Route & URL Direct Entry (Role Security)
- **Action**: Unauthenticated browser visits `http://localhost:5173/admin/students` directly.
- **Expected Result**: `ProtectedRoute` intercepts request, saves location in state, and redirects to `/login`. Upon authentication, user is returned to requested URL.
- **Actual Result**: Instant redirection to `/login`; after login, user navigates directly to `/admin/students`.
- **Outcome**: **PASSED**

### Scenario 4: Cross-Role URL Access Prevention
- **Role**: `parent@skywings.com`
- **Action**: Parent types `http://localhost:5173/admin/fees` directly into browser URL bar.
- **Expected Result**: `ProtectedRoute` checks `allowedRoles={['admin']}`, rejects parent role, and redirects to `/unauthorized` (403 page).
- **Actual Result**: Redirected to `/unauthorized` showing "403 — Access Denied". Admin routes remain protected.
- **Outcome**: **PASSED**

### Scenario 5: Timetable Conflict Detection
- **Action**: Schedule Teacher `Priya Mukherjee` on `Monday` during `Period 1` in Grade 9, while she is already assigned to Grade 10 Period 1.
- **Expected Result**: Rejected with HTTP 400 (`Teacher Conflict: This teacher is already assigned to Grade 10 - Sec A on Monday during Period 1`).
- **Actual Result**: Rejected with exact clash details; conflict avoided.
- **Outcome**: **PASSED**

### Scenario 6: Financial Calculation Integrity
- **Action**: Record partial payment of ₹10,000 on an installment of ₹20,000.
- **Expected Result**: Installment balance updated to ₹10,000; status remains `due`; receipt generated with remaining balance ₹70,000.
- **Actual Result**: Server recalculated totals; receipt `REC-2026-XXXXX` issued accurately.
- **Outcome**: **PASSED**

### Scenario 7: 404 Invalid Route Handling
- **Action**: User types `http://localhost:5173/non-existent-page`.
- **Expected Result**: System catches wildcard route `*` and renders custom 404 page with "Return to Dashboard" button.
- **Actual Result**: Custom `NotFound.jsx` rendered without crashing.
- **Outcome**: **PASSED**

---

## 3. Bug Tracker & Issue Resolution Matrix

| Issue ID | Description | Severity | Steps to Reproduce | Expected Result | Actual Result | Resolution Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Missing Tailwind CSS directives in empty `index.css`. | High | Build client without `@import "tailwindcss"`. | Components styled with full Tailwind utilities. | Styles unrendered. | **RESOLVED**: Configured `@tailwindcss/vite` in `vite.config.js` and added `@import "tailwindcss";` in `index.css`. |
| **BUG-002** | Timezone offset causing date mismatch on attendance lookup. | Medium | Query attendance on UTC midnight. | Attendance records match local calendar date. | Record shifted by 1 day in UTC+. | **RESOLVED**: Added `normalizeDate` utility setting date hours to 00:00:00 local time. |
| **BUG-003** | Roll number collision across different academic sessions. | High | Assign roll 101 in 2025-26 and 2026-27. | Roll uniqueness should only apply within the same session. | Unique constraint failed globally. | **RESOLVED**: Composite index updated to `{ class: 1, section: 1, academicSession: 1, rollNumber: 1 }`. |
| **BUG-004** | Potential exposure of user passwords in audit log collection. | Critical | Inspect MongoDB `AuditLog` on user creation. | Passwords omitted from audit details. | Password hashes could be serialized in request body dump. | **RESOLVED**: Added strict field scrubbing in `auditLogger.js` deleting `password`, `token`, and `secret`. |
| **BUG-005** | Browser refresh breaking page state on deep nested routes. | High | Refresh browser at `/admin/students`. | Route reloads properly without 404 or state loss. | White screen or state reset. | **RESOLVED**: Implemented centralized `AppRoutes.jsx` using React Router DOM v7 with `BrowserRouter` and persistent `AuthContext` validation. |
| **BUG-006** | Unauthorized direct URL navigation to administrative modules. | Critical | Manually navigate to `/admin/fees` while logged in as parent. | System denies access and redirects. | Potential view leak. | **RESOLVED**: Wrapped all role-specific sub-routes with `ProtectedRoute allowedRoles={['admin']}`. |
