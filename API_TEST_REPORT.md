# Mawaheb — API Endpoint Test Report

**Date:** 2026-10-28  
**Frontend:** `mawaheb-web` (branch `main`, Vite dev server on http://localhost:5173)  
**Backend:** `mawaheb-backend` (branch `feat/institute-portal`, http://localhost:3000, local MongoDB `mawaheb-api`)  
**Scope:** every HTTP call the frontend makes (`src/services/api/*`, plus the `fetch`/`axios` calls inside pages), tested against the running backend with the same payloads the pages send.

> Nothing was fixed. This report lists findings only.

---

## 1. Summary

| | Count |
|---|---|
| Automated checks run | **250** (+4 manual upload checks) |
| ✅ Passed | **235** |
| ❌ Failed | **15** (+4 upload checks, all failed) |
| Distinct problems found | **24** (listed in §3) |

### Results by area

| Area | ✅ Pass | ❌ Fail | Verdict |
|---|---|---|---|
| Auth (signup, login, forgot/reset password) | 20 | 1 | Works; one minor error-handling bug |
| Role requests (request → admin approve) | 7 | 0 | Works |
| Admin portal (stats, users, analytics, reports) | 24 | 4 | Mostly works; role-change page is broken; two security holes |
| User profile | 9 | 1 | Works; University page is broken |
| Notes / Difficulties / Courses / Events / Achievements / Financial reports (CRUD) | 47 | 1 | Text CRUD works; **all image uploads fail** |
| Certificates (CRUD) | 6 | 2 | Works, but **any user can edit or delete anyone's certificate** |
| Tickets | 9 | 0 | Works |
| Scholarship student (records, semesters, reports) | 11 | 5 | **Editing and deleting semesters and student reports is broken** |
| Institute portal (staff) | 74 | 0 | Works (file attachments not tested, see §4) |
| Institute student portal | 18 | 1 | Works, except a student can't open their own threads |
| Guardian portal | 9 | 0 | Works |

### Where the problems are

| Location | Problems |
|---|---|
| **Backend** | 15 |
| **Frontend** | 3 |
| **Both** (contract mismatch: the two sides disagree) | 5 |
| **Config / environment** | 1 |

---

## 2. How it was tested

1. Mapped every API call in the frontend: method, path, request body, and how the page parses the response.
2. Mapped every route in the backend (`index.js`, `routes/*.js`) and cross-checked the two lists.
3. Ran a scripted test against the live local backend with one real account per role:
   - Admin (existing seeded admin).
   - Throwaway `qa-*@qa.test` accounts: plain User, Scholarship Student and Employee (promoted through the real role-request → admin-approval flow), plus institute `super_admin`, `trainer`, `gate_guard` and `student` (created through `POST /institute/members`), and a Guardian (logged in with the student's academic number + PIN).
4. For every endpoint: the happy path, an access-control check (wrong role, another user's record, no token, bad token), and, for create/update, the exact field names the page sends.
5. Compared each response shape with the code that reads it in the page.
6. **Cleanup:** the database was backed up to JSON before testing. Afterwards every document that wasn't in the backup was deleted (11 test users plus their notes, threads, fees, etc.). The final check showed the DB matching the backup exactly, with no pre-existing record modified.

**Not exercised** (to avoid sending data to outside services): real file uploads to Cloudinary and sending password-reset emails. See §4.

---

## 3. Problems found

Severity: 🔴 Critical (security / data loss) · 🟠 High (feature broken) · 🟡 Medium (wrong behavior, workaround exists) · ⚪ Low (cosmetic, dead code, edge cases)

### 🔴 Critical: security

| # | Problem | Endpoint | Where | Evidence |
|---|---|---|---|---|
| S1 | **Employee API has no authentication at all.** Anyone on the internet can list, read, create, update and delete employee records. Tested: `GET /employee` with **no token** → `200`. | `GET/POST/PUT/DELETE /employee[/:id]` | **Backend** | `mawaheb-backend/routes/employeeRoutes.js:13-18` (no `authenticated` / `isAdmin` middleware) |
| S2 | **Any logged-in user can download the full user list** (names, emails, phone numbers, roles, institute ranks). Tested as a plain "User" → `200` with every account. | `GET /user/users` | **Backend** | `routes/userRoutes.js:10` has only `authenticated`; `controllers/userController.js:184-187` returns `User.find()` with no role check |
| S3 | **Any logged-in user can edit or delete any other user's certificates.** Tested: user B updated and deleted user A's certificate → `200`. (The other content types correctly return 403/404.) | `PUT/DELETE /certificates/:id` | **Backend** | `controllers/certificateController.js:97` and `:118` use `findByIdAndUpdate` / `findByIdAndDelete` with no `user` filter |

### 🟠 High: feature broken

| # | Problem | Endpoint | Where | Evidence |
|---|---|---|---|---|
| H1 | **Image uploads fail for Events, Achievements, Certificates and Financial reports.** Any create/edit with an image returns `400 ENOENT: no such file or directory, open 'uploads/…'`. The `uploads/` folder doesn't exist, multer doesn't create it, and the backend never serves `/uploads` (no `express.static`), so even with the folder present the images would 404 in the UI. On Azure, local disk is also wiped on restart. | `POST/PUT /events`, `/userAchievements`, `/certificates`, `/financial-report` with a file | **Backend** | `diskStorage` in `controllers/eventController.js:6`, `userAchievementController.js:6`, `certificateController.js:6`, `financialReportController.js:6`; no static route in `index.js` |
| H2 | **Editing a semester always fails** with `404 Semester not found`. The route param is `:id` but the controller reads `req.params.semesterId`. | `PUT /semester/:id` | **Backend** | `controllers/semesterController.js:72` vs `routes/semesterRoutes.js:10` |
| H3 | **Deleting a semester always fails** with `500 Server error`. The controller uses `University`, which is never imported (`ReferenceError`). | `DELETE /semester/:id` | **Backend** | `controllers/semesterController.js:117` (no `require("../models/University")`) |
| H4 | **Editing or deleting a student report always fails** with `404 Student report not found`. The query filters on `userId`, but the model field is `user`. | `PUT/DELETE /studentReport/:reportId` | **Backend** | `controllers/studentReportController.js:94` and `:124`; model uses `user` (`models/StudentReport.js:5`) |
| H5 | **Admin "change role" page is broken.** The page calls an endpoint that doesn't exist → `404 Cannot PUT`. (The only working way to change a role is the role-request approval flow.) | `PUT /admin/users/:id/role` | **Both**: frontend calls a route the backend never implemented | `src/pages/adminDashboard/Roles.jsx:54`; `mawaheb-backend/routes/adminRoutes.js` only has `GET /users` |
| H6 | **Institute students can't open their own correspondence or bug-report threads** → `403 غير مصرح`. The ownership check compares the thread's author, after `populate("author")` has replaced it with an object, against the user id, so it never matches. | `GET /institute/me/threads/:id` (and the reply endpoint uses the same check) | **Backend** | `controllers/institute/studentController.js:212-214` (`ownsThread`) + `:273` (`.populate("author", "name")` runs before the check) |
| H7 | **Employee "Student reports" page always shows "access denied".** The page calls an admin-only endpoint → `403 Not an admin`. | `GET /allReports` as Employee | **Both**: the backend should allow Employees, or the frontend shouldn't show this page to them | `src/pages/employeeDashboard/StudentReports.jsx:20`; `mawaheb-backend/routes/studentReportRoutes.js:18-21` (`isAdmin`) |
| H8 | **University details page always fails.** The backend has no `/university` route → `404`. The page is routed at `/universityDetails`. | `GET /university/:id` | **Both**: frontend page with no backend endpoint | `src/pages/UniversityDetails.jsx:22`; no route in `mawaheb-backend/index.js` |

### 🟡 Medium: wrong behavior

| # | Problem | Endpoint | Where | Evidence |
|---|---|---|---|---|
| M1 | **Editing a financial report saves, then the page crashes.** The backend returns `{ report }` but the page reads `data.financialReport._id` → `TypeError`, and the list doesn't refresh. | `PUT /financial-report/:id` | **Both** (contract mismatch; quickest fix is the frontend) | `src/pages/FinancialReport.jsx:102`; `mawaheb-backend/controllers/financialReportController.js:108` |
| M2 | **Admin "Financial overview" and the admin dashboard financial card show only the admin's own reports** (normally none), not the students'. The backend endpoint is scoped to the logged-in user. | `GET /financial-report` as Admin | **Backend** (no admin "all reports" endpoint) / **Frontend** (reuses the per-user endpoint) | `controllers/financialReportController.js:64`; `src/pages/adminDashboard/AdminFinancialOverview.jsx:21`, `src/services/api/adminApi.js:6` |
| M3 | **Semester "cumulative GPA" (total GPA) is never saved.** The controller saves `totalGPA`, but the schema field is `totalGpa`, so Mongoose drops it. The list always shows `0.0`. | `POST /semester` | **Backend** | `controllers/semesterController.js:27` vs `models/Semester.js:21`; displayed at `src/pages/scholarshipStudentPages/SemesterList.jsx:152` |
| M4 | **General ("User" role) student dashboard always shows zero statistics.** `/user/profile` only includes `statistics` for Admin, Scholarship Student and Institute Student, but the frontend shows `InstituteStudentDash` (which reads `statistics`) to everyone else. | `GET /user/profile` | **Both** | `mawaheb-backend/controllers/userController.js:152-174`; `src/pages/InstituteStudentDash/InstituteStudentDash.jsx:54`, `src/pages/StudentDashboard.jsx:24` |
| M5 | **File uploads to Cloudinary can't work locally.** The backend `.env` has no `CLOUDINARY_*` keys. This affects profile pictures, scholarship course images, and all institute attachments (results, evaluations, behavior, correspondence, bugs, student achievements). | multipart endpoints using `utils/cloudinary*` | **Config** | `mawaheb-backend/.env` (only PORT, MONGODB_URI, INITIAL_ADMIN_*, ACCESS_TOKEN_SECRET, JWT_EXPIRES_IN) |
| M6 | **Role changes only take effect after the user logs out and back in.** The role is baked into the JWT, and some checks (e.g. `GET /admin/users`, role-request approval) read `req.user.role` from the token instead of the DB. | various | **Backend** (design) | e.g. `controllers/userController.js:526`, `:634` |

### ⚪ Low

| # | Problem | Where | Evidence |
|---|---|---|---|
| L1 | Reset-password with an invalid or expired link returns `500 jwt malformed` instead of a clean `400 "link expired"`. | **Backend** | `controllers/authController.js:139` (`jwt.verify` error not mapped to 400) |
| L2 | `GET /notes/:id` always returns `403` even for the owner (`req.user._id` is undefined; the token has `id`). Not used by the UI today. | **Backend** | `controllers/noteController.js:37` |
| L3 | Deleting an institute member leaves orphan data (fees, installments, leave requests, ideas, threads). | **Backend** | `controllers/institute/memberController.js:266` |
| L4 | Validation errors (missing/invalid fields) come back as `500 Server error` instead of `400` on several older endpoints (e.g. semester create). | **Backend** | e.g. `controllers/semesterController.js` catch blocks |
| L5 | Dead code: `AllReports.jsx` calls `GET /reports` (doesn't exist) but the page isn't routed. `OldProfile.jsx` isn't routed either. | **Frontend** | `src/pages/scholarshipStudentPages/AllReports.jsx:27`, `src/pages/OldProfile.jsx` |
| L6 | `axiosClient` and `guardianApi` fall back to `http://localhost:5000/api` when `VITE_API_URL` is missing. The real backend is on port 3000 with **no** `/api` prefix, so a build without the env var hits the wrong server. | **Frontend** | `src/services/api/axiosClient.js:3`, `src/services/api/guardianApi.js:6` |
| L7 | Code health: `npm run lint` → 87 errors, 19 warnings. `npm audit` → 15 vulnerable dependencies (13 high). Main JS bundle > 500 kB. | **Frontend** | `npm run lint`, `npm audit`, `vite build` |

---

## 4. Not tested / limits

- **Real file uploads to Cloudinary** (profile picture, scholarship courses, institute results/evaluations/behavior/correspondence/bugs/achievements attachments). Not tested because Cloudinary isn't configured locally (M5) and uploading would send files to an external service. The text parts of these endpoints were tested and work.
- **Password-reset email.** Only tested with an unknown email so no real mail was sent. Email delivery wasn't checked.
- **Browser UI.** This report covers the API layer plus a code review of how each page reads responses. Pages weren't clicked through in a browser.
- **Business rules** (e.g. which institute rank may create announcements) were checked only where the code clearly states the rule (admin-only groups, student-only endpoints, ownership).

---

## 5. What works ✅

- **Auth:** signup (incl. duplicate/missing-field validation), login (wrong password / unknown email handled), JWT checks (no token / garbage token → 401).
- **Role requests:** user requests a role → admin lists pending → approves; non-admins are blocked.
- **Admin:** dashboard stats, paginated user list with search, analytics summaries (all 8 categories), all student reports, tickets management, programs hub counts.
- **Student content:** list/create/read/update/delete without images for Notes, Difficulties, Courses, Events, Achievements, Financial reports, with correct ownership protection (except Certificates, S3).
- **Tickets:** create, my tickets, all tickets (admin), status update, delete; plain users can't list all or delete others' tickets.
- **Scholarship:** scholarship record create/update/delete, semester list/create, report options, report create/read.
- **Institute staff portal (74/74):** dashboard, academic years (CRUD + training window), promotion, members (CRUD + stats), announcements, behavior, leave (request → decision → gate check-out/in), results, evaluations, courses (+ issue certificates), achievements, ideas (+ judging), fees (+ installments), correspondence & bug threads (create, reply, status). Role guards hold (trainer blocked from members/fees).
- **Institute student portal:** all 13 "my …" pages, submitting leave/ideas/achievements/correspondence/bugs, replying; staff blocked from student endpoints.
- **Guardian portal:** login (wrong PIN rejected), overview/results/evaluations/behavior/fees, guardian token correctly rejected on normal user endpoints.

---

## Appendix: every check

| | Area | Check | Endpoint | As | HTTP |
|---|---|---|---|---|---|
| ✅ | Health | Backend health page | `GET /` | anonymous | 200 |
| ✅ | Auth | Login as admin | `POST /auth/login` | anonymous | 200 |
| ✅ | Auth | Login with wrong password | `POST /auth/login` | anonymous | 400 |
| ✅ | Auth | Login with unknown email | `POST /auth/login` | anonymous | 404 |
| ✅ | Auth | Signup (user) | `POST /auth/signup` | anonymous | 201 |
| ✅ | Auth | Login as user | `POST /auth/login` | anonymous | 200 |
| ✅ | Auth | Signup (scholar) | `POST /auth/signup` | anonymous | 201 |
| ✅ | Auth | Login as scholar | `POST /auth/login` | anonymous | 200 |
| ✅ | Auth | Signup (employee) | `POST /auth/signup` | anonymous | 201 |
| ✅ | Auth | Login as employee | `POST /auth/login` | anonymous | 200 |
| ✅ | Auth | Signup (victim) | `POST /auth/signup` | anonymous | 201 |
| ✅ | Auth | Login as victim | `POST /auth/login` | anonymous | 200 |
| ✅ | Auth | Signup with duplicate email | `POST /auth/signup` | anonymous | 400 |
| ✅ | Auth | Signup with missing fields | `POST /auth/signup` | anonymous | 400 |
| ✅ | Auth | Forgot password (unknown email — no mail sent) | `POST /auth/forgot-Password` | anonymous | 404 |
| ❌ | Auth | Reset password with bogus token | `POST /auth/reset-password/bogus-token` | anonymous | 500 |
| ✅ | User | Profile (scholar) | `GET /user/profile` | scholar | 200 |
| ✅ | User | Profile (employee) | `GET /user/profile` | employee | 200 |
| ✅ | Roles | Submit role request → Scholarship Student | `POST /user/role-request` | scholar | 200 |
| ✅ | Roles | Submit role request → Employee | `POST /user/role-request` | employee | 200 |
| ✅ | Roles | List pending role requests (admin) | `GET /user/admin/role-requests` | admin | 200 |
| ✅ | Roles | List pending role requests as plain user (should be denied) | `GET /user/admin/role-requests` | user | 403 |
| ✅ | Roles | Approve role request as plain user (should be denied) | `PUT /user/admin/role-requests/:id` | user | 403 |
| ✅ | Roles | Approve scholar role request (admin) | `PUT /user/admin/role-requests/:id` | admin | 200 |
| ✅ | Roles | Approve employee role request (admin) | `PUT /user/admin/role-requests/:id` | admin | 200 |
| ✅ | Auth | Login as scholar | `POST /auth/login` | anonymous | 200 |
| ✅ | Auth | Login as employee | `POST /auth/login` | anonymous | 200 |
| ✅ | Admin | Admin stats (useAdminStats) | `GET /stats/admin` | admin | 200 |
| ✅ | Admin | Admin stats as plain user (should be denied) | `GET /stats/admin` | user | 403 |
| ✅ | Admin | General stats | `GET /stats/general` | admin | 200 |
| ✅ | Admin | All users list (AllUsers.jsx) | `GET /admin/users?page=1&limit=10&search=&role=` | admin | 200 |
| ✅ | Admin | All users list as plain user (should be denied) | `GET /admin/users` | user | 403 |
| ✅ | Admin | Roles page user search (Roles.jsx) | `GET /admin/users?limit=50&search=qa` | admin | 200 |
| ❌ | Admin | Change user role (Roles.jsx) | `PUT /admin/users/:id/role` | admin | 404 |
| ✅ | Admin | Analytics user summary category=courses (Analytics.jsx) | `GET /user/summary?category=courses&limit=100` | admin | 200 |
| ✅ | Admin | Analytics user summary category=certificates (Analytics.jsx) | `GET /user/summary?category=certificates&limit=100` | admin | 200 |
| ✅ | Admin | Analytics user summary category=reports (Analytics.jsx) | `GET /user/summary?category=reports&limit=100` | admin | 200 |
| ✅ | Admin | Analytics user summary category=difficulties (Analytics.jsx) | `GET /user/summary?category=difficulties&limit=100` | admin | 200 |
| ✅ | Admin | Analytics user summary category=events (Analytics.jsx) | `GET /user/summary?category=events&limit=100` | admin | 200 |
| ✅ | Admin | Analytics user summary category=financialReports (Analytics.jsx) | `GET /user/summary?category=financialReports&limit=100` | admin | 200 |
| ✅ | Admin | Analytics user summary category=tickets (Analytics.jsx) | `GET /user/summary?category=tickets&limit=100` | admin | 200 |
| ✅ | Admin | Analytics user summary category=userAchievements (Analytics.jsx) | `GET /user/summary?category=userAchievements&limit=100` | admin | 200 |
| ❌ | Admin | User list /user/users as plain user (data exposure check) | `GET /user/users` | user | 200 |
| ✅ | Admin | All student reports (AdminStudentReports.jsx) | `GET /allReports` | admin | 200 |
| ❌ | Admin | All student reports as employee (EmployeeStudentReports.jsx) | `GET /allReports` | employee | 403 |
| ✅ | Admin | Financial reports overview (AdminFinancialOverview.jsx) | `GET /financial-report` | admin | 200 |
| ✅ | Admin | Employees list (EmployeeDashboard.jsx) | `GET /employee?page=1&limit=10` | admin | 200 |
| ❌ | Admin | Employees list with NO token (should be denied) | `GET /employee` | anonymous | 200 |
| ✅ | User | Profile (victim) | `GET /user/profile` | victim | 200 |
| ✅ | Admin | Delete a user as plain user (should be denied) | `DELETE /user/users/:id` | user | 403 |
| ✅ | User | Profile (admin) | `GET /user/profile` | admin | 200 |
| ✅ | User | Profile with no token (should be denied) | `GET /user/profile` | anonymous | 401 |
| ✅ | User | Profile with garbage token (should be denied) | `GET /user/profile` | anonymous | 401 |
| ✅ | User | Update profile (OldProfile.jsx sends JSON) | `PUT /user/update-profile` | user | 200 |
| ✅ | User | Update profile as multipart without image | `PUT /user/update-profile` | user | 200 |
| ❌ | User | University details (UniversityDetails.jsx) | `GET /university/123` | user | 404 |
| ✅ | Notes | List Notes | `GET /notes` | user | 200 |
| ✅ | Notes | Create Notes | `POST /notes` | user | 201 |
| ❌ | Notes | Get one Notes | `GET /notes/:id` | user | 403 |
| ✅ | Notes | Update Notes | `PUT /notes/:id` | user | 200 |
| ✅ | Notes | Update another user's Notes (should be denied) | `PUT /notes/:id` | victim | 403 |
| ✅ | Notes | Delete another user's Notes (should be denied) | `DELETE /notes/:id` | victim | 403 |
| ✅ | Notes | Delete Notes | `DELETE /notes/:id` | user | 200 |
| ✅ | Notes | List Notes without token (should be denied) | `GET /notes` | anonymous | 401 |
| ✅ | Difficulties | List Difficulties | `GET /difficulties` | user | 200 |
| ✅ | Difficulties | Create Difficulties | `POST /difficulties` | user | 201 |
| ✅ | Difficulties | Get one Difficulties | `GET /difficulties/:id` | user | 200 |
| ✅ | Difficulties | Update Difficulties | `PUT /difficulties/:id` | user | 200 |
| ✅ | Difficulties | Update another user's Difficulties (should be denied) | `PUT /difficulties/:id` | victim | 404 |
| ✅ | Difficulties | Delete another user's Difficulties (should be denied) | `DELETE /difficulties/:id` | victim | 404 |
| ✅ | Difficulties | Delete Difficulties | `DELETE /difficulties/:id` | user | 200 |
| ✅ | Difficulties | List Difficulties without token (should be denied) | `GET /difficulties` | anonymous | 401 |
| ✅ | Courses | List Courses | `GET /courses` | user | 200 |
| ✅ | Courses | Create Courses | `POST /courses` | user | 201 |
| ✅ | Courses | Get one Courses | `GET /courses/:id` | user | 200 |
| ✅ | Courses | Update Courses | `PUT /courses/:id` | user | 200 |
| ✅ | Courses | Update another user's Courses (should be denied) | `PUT /courses/:id` | victim | 404 |
| ✅ | Courses | Delete another user's Courses (should be denied) | `DELETE /courses/:id` | victim | 404 |
| ✅ | Courses | Delete Courses | `DELETE /courses/:id` | user | 200 |
| ✅ | Courses | List Courses without token (should be denied) | `GET /courses` | anonymous | 401 |
| ✅ | Events | List Events | `GET /events` | user | 200 |
| ✅ | Events | Create Events | `POST /events` | user | 201 |
| ✅ | Events | Get one Events | `GET /events/:id` | user | 200 |
| ✅ | Events | Update Events | `PUT /events/:id` | user | 200 |
| ✅ | Events | Update another user's Events (should be denied) | `PUT /events/:id` | victim | 404 |
| ✅ | Events | Delete another user's Events (should be denied) | `DELETE /events/:id` | victim | 404 |
| ✅ | Events | Delete Events | `DELETE /events/:id` | user | 200 |
| ✅ | Events | List Events without token (should be denied) | `GET /events` | anonymous | 401 |
| ✅ | Certificates | List Certificates | `GET /certificates` | user | 200 |
| ✅ | Certificates | Create Certificates | `POST /certificates` | user | 201 |
| ✅ | Certificates | Get one Certificates | `GET /certificates/:id` | user | 200 |
| ✅ | Certificates | Update Certificates | `PUT /certificates/:id` | user | 200 |
| ❌ | Certificates | Update another user's Certificates (should be denied) | `PUT /certificates/:id` | victim | 200 |
| ❌ | Certificates | Delete another user's Certificates (should be denied) | `DELETE /certificates/:id` | victim | 200 |
| ✅ | Certificates | Delete Certificates | `DELETE /certificates/:id` | user | 404 |
| ✅ | Certificates | List Certificates without token (should be denied) | `GET /certificates` | anonymous | 401 |
| ✅ | Achievements | List Achievements | `GET /userAchievements` | user | 200 |
| ✅ | Achievements | Create Achievements | `POST /userAchievements` | user | 201 |
| ✅ | Achievements | Get one Achievements | `GET /userAchievements/:id` | user | 200 |
| ✅ | Achievements | Update Achievements | `PUT /userAchievements/:id` | user | 200 |
| ✅ | Achievements | Update another user's Achievements (should be denied) | `PUT /userAchievements/:id` | victim | 404 |
| ✅ | Achievements | Delete another user's Achievements (should be denied) | `DELETE /userAchievements/:id` | victim | 404 |
| ✅ | Achievements | Delete Achievements | `DELETE /userAchievements/:id` | user | 200 |
| ✅ | Achievements | List Achievements without token (should be denied) | `GET /userAchievements` | anonymous | 401 |
| ✅ | Financial reports | List Financial reports | `GET /financial-report` | scholar | 200 |
| ✅ | Financial reports | Create Financial reports | `POST /financial-report` | scholar | 201 |
| ✅ | Financial reports | Get one Financial reports | `GET /financial-report/:id` | scholar | 200 |
| ✅ | Financial reports | Update Financial reports | `PUT /financial-report/:id` | scholar | 200 |
| ✅ | Financial reports | Update another user's Financial reports (should be denied) | `PUT /financial-report/:id` | victim | 404 |
| ✅ | Financial reports | Delete another user's Financial reports (should be denied) | `DELETE /financial-report/:id` | victim | 404 |
| ✅ | Financial reports | Delete Financial reports | `DELETE /financial-report/:id` | scholar | 200 |
| ✅ | Financial reports | List Financial reports without token (should be denied) | `GET /financial-report` | anonymous | 401 |
| ✅ | Admin | Programs hub count /courses (AdminProgramsHub.jsx) | `GET /courses` | admin | 200 |
| ✅ | Admin | Programs hub count /events (AdminProgramsHub.jsx) | `GET /events` | admin | 200 |
| ✅ | Admin | Programs hub count /certificates (AdminProgramsHub.jsx) | `GET /certificates` | admin | 200 |
| ✅ | Admin | Programs hub count /notes (AdminProgramsHub.jsx) | `GET /notes` | admin | 200 |
| ✅ | Admin | Programs hub count /difficulties (AdminProgramsHub.jsx) | `GET /difficulties` | admin | 200 |
| ✅ | Tickets | Create ticket (CreateTicket.jsx) | `POST /tickets` | user | 201 |
| ✅ | Tickets | My tickets (TicketList.jsx / Ticket.jsx) | `GET /tickets/my` | user | 200 |
| ✅ | Tickets | All tickets (AdminTickets.jsx) | `GET /tickets` | admin | 200 |
| ✅ | Tickets | All tickets as plain user (should be denied) | `GET /tickets` | user | 403 |
| ✅ | Tickets | Get ticket by id | `GET /tickets/:id` | user | 200 |
| ✅ | Tickets | Update ticket status (AdminTickets.jsx) | `PUT /tickets/:id` | admin | 200 |
| ✅ | Tickets | Update ticket status with UI value 'In Progress' | `PUT /tickets/:id` | admin | 200 |
| ✅ | Tickets | Delete someone else's ticket as plain user (should be denied) | `DELETE /tickets/:id` | victim | 403 |
| ✅ | Tickets | Delete ticket (AdminTickets.jsx) | `DELETE /tickets/:id` | admin | 200 |
| ✅ | Scholarship | Scholarship dashboard profile | `GET /user/profile` | scholar | 200 |
| ✅ | Scholarship | List scholarship-student records (ScholarshipStudent.jsx) | `GET /scholarship-student` | scholar | 200 |
| ✅ | Scholarship | Create scholarship-student record | `POST /scholarship-student` | scholar | 201 |
| ✅ | Scholarship | Update scholarship-student record | `PUT /scholarship-student/:id` | scholar | 200 |
| ✅ | Scholarship | Semesters list (SemesterList.jsx) | `GET /semester/all` | scholar | 200 |
| ✅ | Scholarship | Create semester | `POST /semester` | scholar | 201 |
| ❌ | Scholarship | Update semester | `PUT /semester/:id` | scholar | 404 |
| ✅ | Scholarship | Student report options (StudentReport.jsx) | `GET /studentReports/options` | scholar | 200 |
| ✅ | Scholarship | My student reports (StudentReportList/StudentReportPage) | `GET /studentReports` | scholar | 200 |
| ✅ | Scholarship | Create student report | `POST /studentReport` | scholar | 201 |
| ✅ | Scholarship | Get student report by id | `GET /studentReport/:id` | scholar | 200 |
| ❌ | Scholarship | Update student report | `PUT /studentReport/:id` | scholar | 404 |
| ❌ | Scholarship | Delete student report | `DELETE /studentReport/:id` | scholar | 404 |
| ❌ | Scholarship | All reports page (AllReports.jsx → /reports) | `GET /reports` | scholar | 404 |
| ❌ | Scholarship | Delete semester | `DELETE /semester/:id` | scholar | 500 |
| ✅ | Scholarship | Delete scholarship-student record | `DELETE /scholarship-student/:id` | scholar | 200 |
| ✅ | Institute | Dashboard | `GET /institute/dashboard` | admin | 200 |
| ✅ | Institute | Dashboard as plain user (should be denied) | `GET /institute/dashboard` | user | 403 |
| ✅ | Institute | List academic years | `GET /institute/academic-years` | admin | 200 |
| ✅ | Institute | Create academic year | `POST /institute/academic-years` | admin | 201 |
| ✅ | Institute | Update academic year | `PUT /institute/academic-years/:id` | admin | 200 |
| ✅ | Institute | Save training window | `PUT /institute/academic-years/:id/training` | admin | 200 |
| ✅ | Institute | Delete academic year | `DELETE /institute/academic-years/:id` | admin | 200 |
| ✅ | Institute | Promotable students | `GET /institute/students/promotable?level=secondary_1` | admin | 200 |
| ✅ | Institute | Member stats | `GET /institute/members/stats` | admin | 200 |
| ✅ | Institute | List members | `GET /institute/members` | admin | 200 |
| ✅ | Institute | Create member (super_admin) | `POST /institute/members` | admin | 201 |
| ✅ | Auth | Login as super | `POST /auth/login` | anonymous | 200 |
| ✅ | Institute | Create member (trainer) | `POST /institute/members` | admin | 201 |
| ✅ | Auth | Login as trainer | `POST /auth/login` | anonymous | 200 |
| ✅ | Institute | Create member (gate_guard) | `POST /institute/members` | admin | 201 |
| ✅ | Auth | Login as guard | `POST /auth/login` | anonymous | 200 |
| ✅ | Institute | Create member (student) | `POST /institute/members` | admin | 201 |
| ✅ | Auth | Login as istudent | `POST /auth/login` | anonymous | 200 |
| ✅ | Institute | Get member | `GET /institute/members/:id` | admin | 200 |
| ✅ | Institute | Update member | `PUT /institute/members/:id` | admin | 200 |
| ✅ | Institute | Members list as trainer (should be denied — admin only) | `GET /institute/members` | trainer | 403 |
| ✅ | Institute | Promote students | `POST /institute/students/promote` | admin | 400 |
| ✅ | Institute | Batches | `GET /institute/batches` | admin | 200 |
| ✅ | Institute | Students (lite) | `GET /institute/students?batch=QA-…` | admin | 200 |
| ✅ | Institute | Staff (lite) | `GET /institute/staff` | admin | 200 |
| ✅ | Institute | List announcements | `GET /institute/announcements` | admin | 200 |
| ✅ | Institute | Create announcement | `POST /institute/announcements` | super | 201 |
| ✅ | Institute | Update announcement | `PUT /institute/announcements/:id` | super | 200 |
| ✅ | Institute | Behavior stats | `GET /institute/behavior/stats` | admin | 200 |
| ✅ | Institute | List behavior | `GET /institute/behavior` | admin | 200 |
| ✅ | Institute | Create behavior entry (no attachment) | `POST /institute/behavior` | trainer | 201 |
| ✅ | Institute | Leave stats | `GET /institute/leave/stats` | admin | 200 |
| ✅ | Institute | List leave | `GET /institute/leave` | admin | 200 |
| ✅ | Institute | Student submits leave request | `POST /institute/leave` | istudent | 201 |
| ✅ | Institute | Staff submits leave request (createLeave used by admin page) | `POST /institute/leave` | admin | 403 |
| ✅ | Institute | Approve leave (decision) | `PUT /institute/leave/:id/decision` | super | 200 |
| ✅ | Institute | Gate guard logs exit | `PUT /institute/leave/:id/gate` | guard | 200 |
| ✅ | Institute | Gate guard logs return | `PUT /institute/leave/:id/gate` | guard | 200 |
| ✅ | Institute | List results | `GET /institute/results` | admin | 200 |
| ✅ | Institute | Upload result without file | `POST /institute/results` | trainer | 400 |
| ✅ | Institute | List evaluations | `GET /institute/evaluations` | admin | 200 |
| ✅ | Institute | Upload evaluation without file | `POST /institute/evaluations` | trainer | 400 |
| ✅ | Institute | Course stats | `GET /institute/courses/stats` | admin | 200 |
| ✅ | Institute | List institute courses | `GET /institute/courses` | admin | 200 |
| ✅ | Institute | Create institute course | `POST /institute/courses` | super | 201 |
| ✅ | Institute | Update institute course | `PUT /institute/courses/:id` | super | 200 |
| ✅ | Institute | Issue certificates for course | `POST /institute/courses/:id/issue-certificates` | super | 200 |
| ✅ | Institute | Achievement stats | `GET /institute/achievements/stats` | admin | 200 |
| ✅ | Institute | List achievements | `GET /institute/achievements` | admin | 200 |
| ✅ | Institute | Student submits achievement without file | `POST /institute/achievements` | istudent | 201 |
| ✅ | Institute | Idea stats | `GET /institute/ideas/stats` | admin | 200 |
| ✅ | Institute | List ideas | `GET /institute/ideas` | admin | 200 |
| ✅ | Institute | Student submits idea | `POST /institute/ideas` | istudent | 201 |
| ✅ | Institute | Judge idea | `PUT /institute/ideas/:id/judge` | super | 200 |
| ✅ | Institute | Fee stats | `GET /institute/fees/stats` | admin | 200 |
| ✅ | Institute | List fees | `GET /institute/fees` | admin | 200 |
| ✅ | Institute | Set fee total for student | `PUT /institute/fees/:id` | admin | 200 |
| ✅ | Institute | List fees after set | `GET /institute/fees` | admin | 200 |
| ✅ | Institute | Fees as trainer (should be denied) | `GET /institute/fees` | trainer | 403 |
| ✅ | Institute | Correspondence stats | `GET /institute/correspondence/stats` | admin | 200 |
| ✅ | Institute | List Correspondence | `GET /institute/correspondence` | admin | 200 |
| ✅ | Institute | Create Correspondence thread (staff) | `POST /institute/correspondence` | super | 201 |
| ✅ | Institute | Get Correspondence thread | `GET /institute/correspondence/:id` | super | 200 |
| ✅ | Institute | Reply to Correspondence thread | `POST /institute/correspondence/:id/reply` | super | 201 |
| ✅ | Institute | Set Correspondence status | `PUT /institute/correspondence/:id/status` | super | 200 |
| ✅ | Institute | Bugs stats | `GET /institute/bugs/stats` | admin | 200 |
| ✅ | Institute | List Bugs | `GET /institute/bugs` | admin | 200 |
| ✅ | Institute | Create Bugs thread (staff) | `POST /institute/bugs` | super | 201 |
| ✅ | Institute | Get Bugs thread | `GET /institute/bugs/:id` | super | 200 |
| ✅ | Institute | Reply to Bugs thread | `POST /institute/bugs/:id/reply` | super | 201 |
| ✅ | Institute | Set Bugs status | `PUT /institute/bugs/:id/status` | super | 200 |
| ✅ | Institute student | My overview | `GET /institute/me/overview` | istudent | 200 |
| ✅ | Institute student | My announcements | `GET /institute/me/announcements` | istudent | 200 |
| ✅ | Institute student | My results | `GET /institute/me/results` | istudent | 200 |
| ✅ | Institute student | My evaluations | `GET /institute/me/evaluations` | istudent | 200 |
| ✅ | Institute student | My behavior | `GET /institute/me/behavior` | istudent | 200 |
| ✅ | Institute student | My leave | `GET /institute/me/leave` | istudent | 200 |
| ✅ | Institute student | My ideas | `GET /institute/me/ideas` | istudent | 200 |
| ✅ | Institute student | My achievements | `GET /institute/me/achievements` | istudent | 200 |
| ✅ | Institute student | My courses | `GET /institute/me/courses` | istudent | 200 |
| ✅ | Institute student | My certificates | `GET /institute/me/certificates` | istudent | 200 |
| ✅ | Institute student | My fees | `GET /institute/me/fees` | istudent | 200 |
| ✅ | Institute student | My correspondence | `GET /institute/me/correspondence` | istudent | 200 |
| ✅ | Institute student | My bugs | `GET /institute/me/bugs` | istudent | 200 |
| ✅ | Institute student | My overview as staff (should be denied) | `GET /institute/me/overview` | trainer | 403 |
| ✅ | Institute student | Student starts correspondence | `POST /institute/me/correspondence` | istudent | 201 |
| ✅ | Institute student | Student reports a bug | `POST /institute/me/bugs` | istudent | 201 |
| ❌ | Institute student | Student opens own thread | `GET /institute/me/threads/:id` | istudent | 403 |
| ✅ | Institute student | Student replies in own thread | `POST /institute/me/threads/:id/reply` | istudent | 201 |
| ✅ | Institute student | Institute student dashboard profile (InstituteStudentDash.jsx) | `GET /user/profile` | istudent | 200 |
| ✅ | Guardian | Guardian login | `POST /institute/guardian/login` | anonymous | 200 |
| ✅ | Guardian | Guardian login with wrong PIN | `POST /institute/guardian/login` | anonymous | 401 |
| ✅ | Guardian | Guardian overview | `GET /institute/guardian/overview` | guardian | 200 |
| ✅ | Guardian | Guardian results | `GET /institute/guardian/results` | guardian | 200 |
| ✅ | Guardian | Guardian evaluations | `GET /institute/guardian/evaluations` | guardian | 200 |
| ✅ | Guardian | Guardian behavior | `GET /institute/guardian/behavior` | guardian | 200 |
| ✅ | Guardian | Guardian fees | `GET /institute/guardian/fees` | guardian | 200 |
| ✅ | Guardian | Guardian token used on normal user endpoint (should be denied) | `GET /user/profile` | guardian | 401 |
| ✅ | Guardian | Guardian endpoint without token (should be denied) | `GET /institute/guardian/overview` | anonymous | 401 |
| ✅ | Institute | Delete announcement | `DELETE /institute/announcements/:id` | super | 200 |
| ✅ | Institute | Delete behavior entry | `DELETE /institute/behavior/:id` | super | 200 |
| ✅ | Institute | Delete institute course | `DELETE /institute/courses/:id` | super | 200 |
| ✅ | Institute | Delete member (istudent) | `DELETE /institute/members/:id` | admin | 200 |
| ✅ | Institute | Delete member (super) | `DELETE /institute/members/:id` | admin | 200 |
| ✅ | Institute | Delete member (trainer) | `DELETE /institute/members/:id` | admin | 200 |
| ✅ | Institute | Delete member (guard) | `DELETE /institute/members/:id` | admin | 200 |
| ✅ | User | Profile (victim) for delete | `GET /user/profile` | victim | 200 |
| ✅ | Admin | Delete user (AllUsers.jsx) as admin | `DELETE /user/users/:id` | admin | 200 |
