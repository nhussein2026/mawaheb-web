import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";
import AccountLayout from "./layouts/AccountLayout";
import Loading from "./components/ui/Loading";

// Public Pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./components/profile/Profile"));
const ProfileComponent = lazy(() => import("./pages/NewProfile"));
const Test = lazy(() => import("./components/profile/Profile"));

// Student/General Pages
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const StudentCourse = lazy(() => import("./pages/Course"));
const StudentEvent = lazy(() => import("./pages/Event"));
const Ticket = lazy(() => import("./pages/Ticket"));
const Note = lazy(() => import("./pages/Note"));
const StudentAchievement = lazy(() => import("./pages/Achievement"));
const StudentCertificate = lazy(() => import("./pages/Certificate"));
const Difficulties = lazy(() => import("./pages/Difficulties"));
const ScholarshipStudentForm = lazy(() => import("./pages/scholarshipStudentPages/ScholarshipStudent"));
const UniversityDetails = lazy(() => import("./pages/UniversityDetails"));
const StudentReportPage = lazy(() => import("./pages/scholarshipStudentPages/StudentReportPage"));
const StudentReportList = lazy(() => import("./pages/scholarshipStudentPages/StudentReportList "));
const FinancialReport = lazy(() => import("./pages/FinancialReport"));
const CreateTicket = lazy(() => import("./pages/CreateTicket"));
const TicketList = lazy(() => import("./pages/TicketList"));
const SemesterForm = lazy(() => import("./pages/scholarshipStudentPages/SemesterForm"));
const SemestersList = lazy(() => import("./pages/scholarshipStudentPages/SemesterList"));
const StudentReport = lazy(() => import("./pages/scholarshipStudentPages/StudentReport"));

// Admin & Employee Pages
const AdminDashboard = lazy(() => import("./pages/adminDashboard/AdminDashboard"));
const EmployeeDashboard = lazy(() => import("./pages/employeeDashboard/EmployeeDashboard"));
const EmployeeStudentReports = lazy(() => import("./pages/employeeDashboard/StudentReports"));
const StudentDetails = lazy(() => import("./pages/adminDashboard/StudentDetails"));
const AllUsers = lazy(() => import("./pages/adminDashboard/AllUsers"));
const Roles = lazy(() => import("./pages/adminDashboard/Roles"));
const Analytics = lazy(() => import("./pages/adminDashboard/Analytics"));
const RoleRequestManager = lazy(() => import("./pages/adminDashboard/RoleRequestManager"));
const AdminStudentReports = lazy(() => import("./pages/adminDashboard/AdminStudentReports"));
const AdminTickets = lazy(() => import("./pages/adminDashboard/AdminTickets"));
const AdminProgramsHub = lazy(() => import("./pages/adminDashboard/AdminProgramsHub"));
const AdminFinancialOverview = lazy(() => import("./pages/adminDashboard/AdminFinancialOverview"));
const AdminScholarshipHub = lazy(() => import("./pages/adminDashboard/AdminScholarshipHub"));

const NotFound = lazy(() => import("./pages/404"));

// Institute Portal (بوابة معهد حضرموت للموهوبين)
import InstituteAdminLayout from "./layouts/InstituteAdminLayout";
const InstituteDashboard = lazy(() => import("./pages/instituteAdmin/Dashboard"));
const InstituteYearsStudents = lazy(() => import("./pages/instituteAdmin/YearsStudents"));
const InstituteMembers = lazy(() => import("./pages/instituteAdmin/Members"));
const InstituteAnnouncements = lazy(() => import("./pages/instituteAdmin/Announcements"));
const InstituteBehavior = lazy(() => import("./pages/instituteAdmin/Behavior"));
const InstituteResults = lazy(() => import("./pages/instituteAdmin/Results"));
const InstituteEvaluations = lazy(() => import("./pages/instituteAdmin/Evaluations"));
const InstituteCorrespondence = lazy(() => import("./pages/instituteAdmin/Correspondence"));
const InstituteBugs = lazy(() => import("./pages/instituteAdmin/Bugs"));
const InstituteLeave = lazy(() => import("./pages/instituteAdmin/Leave"));
const InstituteIdeas = lazy(() => import("./pages/instituteAdmin/Ideas"));
const InstituteFees = lazy(() => import("./pages/instituteAdmin/Fees"));
const InstituteCourses = lazy(() => import("./pages/instituteAdmin/Courses"));
const InstituteAchievements = lazy(() => import("./pages/instituteAdmin/Achievements"));

// Institute Student Portal (بوابة الطالب)
import InstituteStudentLayout from "./layouts/InstituteStudentLayout";
const ISOverview = lazy(() => import("./pages/instituteStudent/Overview"));
const ISAnnouncements = lazy(() => import("./pages/instituteStudent/Announcements"));
const ISResults = lazy(() => import("./pages/instituteStudent/Results"));
const ISEvaluations = lazy(() => import("./pages/instituteStudent/Evaluations"));
const ISCourses = lazy(() => import("./pages/instituteStudent/Courses"));
const ISAchievements = lazy(() => import("./pages/instituteStudent/Achievements"));
const ISIdeas = lazy(() => import("./pages/instituteStudent/Ideas"));
const ISLeave = lazy(() => import("./pages/instituteStudent/Leave"));
const ISBehavior = lazy(() => import("./pages/instituteStudent/Behavior"));
const ISCorrespondence = lazy(() => import("./pages/instituteStudent/Correspondence"));
const ISBugs = lazy(() => import("./pages/instituteStudent/Bugs"));
const ISFees = lazy(() => import("./pages/instituteStudent/Fees"));

// Guardian Portal (بوابة ولي الأمر)
import GuardianLayout from "./layouts/GuardianLayout";
const GuardianLogin = lazy(() => import("./pages/guardian/GuardianLogin"));
const GuardianOverview = lazy(() => import("./pages/guardian/GuardianOverview"));
const GuardianResults = lazy(() => import("./pages/guardian/GuardianResults"));
const GuardianEvaluations = lazy(() => import("./pages/guardian/GuardianEvaluations"));
const GuardianBehavior = lazy(() => import("./pages/guardian/GuardianBehavior"));
const GuardianFees = lazy(() => import("./pages/guardian/GuardianFees"));

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* ACCOUNT ROUTES — rendered inside the signed-in user's own shell */}
        <Route element={<AccountLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/pro" element={<Test />} />
          <Route path="/test" element={<ProfileComponent />} />
          <Route path="/universityDetails" element={<UniversityDetails />} />
        </Route>

        {/* STUDENT ROUTES */}
        <Route element={<StudentLayout />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentCourse />} />
          <Route path="/student/events" element={<StudentEvent />} />
          <Route path="/student/tickets" element={<Ticket />} />
          <Route path="/notes" element={<Note />} />
          <Route path="/student/achievements" element={<StudentAchievement />} />
          <Route path="/student/certificates" element={<StudentCertificate />} />
          <Route path="/student/difficulties" element={<Difficulties />} />
          <Route path="/student/scholarship-student-form" element={<ScholarshipStudentForm />} />
          <Route path="/try-report" element={<StudentReport />} />
          <Route path="/try-report-list" element={<StudentReportList />} />
          <Route path="/semester-list" element={<SemestersList />} />
          <Route path="/semester-create" element={<SemesterForm />} />
          <Route path="/student/financial-report" element={<FinancialReport />} />
          <Route path="/student-report" element={<StudentReportPage />} />
          <Route path="/my-reports" element={<StudentReportList />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/ticket-list" element={<TicketList />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="roles" element={<Roles />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="role-requests" element={<RoleRequestManager />} />
          <Route path="reports" element={<AdminStudentReports />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="programs" element={<AdminProgramsHub />} />
          <Route path="financial" element={<AdminFinancialOverview />} />
          <Route path="scholarship" element={<AdminScholarshipHub />} />
        </Route>
        
        {/* EMPLOYEE ROUTES */}
        <Route path="/employee-dashboard" element={<AdminLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="reports" element={<EmployeeStudentReports />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="programs" element={<AdminProgramsHub />} />
        </Route>

        {/* Student details used by admin */}
        <Route path="/student/details" element={<AdminLayout />}>
          <Route index element={<StudentDetails />} />
        </Route>

        {/* INSTITUTE PORTAL ROUTES (بوابة المعهد) — every tab is a real route */}
        <Route path="/institute-admin" element={<InstituteAdminLayout />}>
          <Route index element={<InstituteDashboard />} />
          <Route path="academic" element={<InstituteYearsStudents />} />
          <Route path="members" element={<InstituteMembers />} />
          <Route path="notices" element={<InstituteAnnouncements />} />
          <Route path="bugs" element={<InstituteBugs />} />
          <Route path="results" element={<InstituteResults />} />
          <Route path="evaluations" element={<InstituteEvaluations />} />
          <Route path="courses" element={<InstituteCourses />} />
          <Route path="correspondence" element={<InstituteCorrespondence />} />
          <Route path="behavior" element={<InstituteBehavior />} />
          <Route path="leave" element={<InstituteLeave />} />
          <Route path="achievements" element={<InstituteAchievements />} />
          <Route path="ideas" element={<InstituteIdeas />} />
          <Route path="fees" element={<InstituteFees />} />
        </Route>

        {/* INSTITUTE STUDENT PORTAL ROUTES (بوابة الطالب) */}
        <Route path="/institute-portal" element={<InstituteStudentLayout />}>
          <Route index element={<ISOverview />} />
          <Route path="announcements" element={<ISAnnouncements />} />
          <Route path="results" element={<ISResults />} />
          <Route path="evaluations" element={<ISEvaluations />} />
          <Route path="courses" element={<ISCourses />} />
          <Route path="achievements" element={<ISAchievements />} />
          <Route path="ideas" element={<ISIdeas />} />
          <Route path="leave" element={<ISLeave />} />
          <Route path="behavior" element={<ISBehavior />} />
          <Route path="correspondence" element={<ISCorrespondence />} />
          <Route path="bugs" element={<ISBugs />} />
          <Route path="fees" element={<ISFees />} />
        </Route>

        {/* GUARDIAN PORTAL ROUTES (بوابة ولي الأمر) — read-only, own token */}
        <Route path="/guardian/login" element={<GuardianLogin />} />
        <Route path="/guardian" element={<GuardianLayout />}>
          <Route index element={<GuardianOverview />} />
          <Route path="results" element={<GuardianResults />} />
          <Route path="evaluations" element={<GuardianEvaluations />} />
          <Route path="behavior" element={<GuardianBehavior />} />
          <Route path="fees" element={<GuardianFees />} />
        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<PublicLayout />}>
           <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
      </Suspense>
      {/* Toasts confirm actions: bottom inline-end corner, at most three,
          5 s and paused on hover or focus (§4.8). */}
      <ToastContainer
        position="bottom-left"
        rtl
        limit={3}
        autoClose={5000}
        pauseOnHover
        pauseOnFocusLoss
        closeOnClick={false}
        hideProgressBar
        newestOnTop={false}
        theme="light"
      />
    </>
  );
}

export default App;
