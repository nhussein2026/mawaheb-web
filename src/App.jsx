import React from "react";
import { Route, Routes } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./components/profile/Profile";
import ProfileComponent from "./pages/NewProfile";
import Test from "./components/profile/Profile";

// Student/General Pages
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourse from "./pages/Course";
import StudentEvent from "./pages/Event";
import Ticket from "./pages/Ticket";
import Note from "./pages/Note";
import StudentAchievement from "./pages/Achievement";
import StudentCertificate from "./pages/Certificate";
import Difficulties from "./pages/Difficulties";
import ScholarshipStudentForm from "./pages/scholarshipStudentPages/ScholarshipStudent";
import UniversityDetails from "./pages/UniversityDetails";
import StudentReportPage from "./pages/scholarshipStudentPages/StudentReportPage";
import StudentReportList from "./pages/scholarshipStudentPages/StudentReportList ";
import FinancialReport from "./pages/FinancialReport";
import CreateTicket from "./pages/CreateTicket";
import TicketList from "./pages/TicketList";
import SemesterForm from "./pages/scholarshipStudentPages/SemesterForm";
import SemestersList from "./pages/scholarshipStudentPages/SemesterList";
import StudentReport from "./pages/scholarshipStudentPages/StudentReport";

// Admin & Employee Pages
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import EmployeeDashboard from "./pages/employeeDashboard/EmployeeDashboard";
import EmployeeStudentReports from "./pages/employeeDashboard/StudentReports";
import StudentDetails from "./pages/adminDashboard/StudentDetails";
import AllUsers from "./pages/adminDashboard/AllUsers";
import Roles from "./pages/adminDashboard/Roles";
import Analytics from "./pages/adminDashboard/Analytics";
import RoleRequestManager from "./pages/adminDashboard/RoleRequestManager";
import AdminStudentReports from "./pages/adminDashboard/AdminStudentReports";
import AdminTickets from "./pages/adminDashboard/AdminTickets";
import AdminProgramsHub from "./pages/adminDashboard/AdminProgramsHub";
import AdminFinancialOverview from "./pages/adminDashboard/AdminFinancialOverview";
import AdminScholarshipHub from "./pages/adminDashboard/AdminScholarshipHub";

import NotFound from "./pages/404";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
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

        {/* CATCH ALL */}
        <Route path="*" element={<PublicLayout />}>
           <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
