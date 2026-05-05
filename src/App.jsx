import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./components/profile/Profile";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentCourse from "./pages/Course";
import StudentEvent from "./pages/Event";
import Ticket from "./pages/Ticket";
import Note from "./pages/Note";
import StudentAchievement from "./pages/Achievement";
import StudentCertificate from "./pages/Certificate";
import Header from "./components/layout/Header";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Difficulties from "./pages/Difficulties";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import ScholarshipStudentForm from "./pages/scholarshipStudentPages/ScholarshipStudent";
import UniversityDetails from "./pages/UniversityDetails";
import StudentReportPage from "./pages/scholarshipStudentPages/StudentReportPage";
import StudentReportList from "./pages/scholarshipStudentPages/StudentReportList ";
import FinancialReport from "./pages/FinancialReport";
import StudentDetails from "./pages/adminDashboard/StudentDetails";
import CreateTicket from "./pages/CreateTicket";
import TicketList from "./pages/TicketList";
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
import ProfileComponent from "./pages/NewProfile";
import Test from "./components/profile/Profile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SemesterForm from "./pages/scholarshipStudentPages/SemesterForm";
import SemestersList from "./pages/scholarshipStudentPages/SemesterList";
import StudentReport from "./pages/scholarshipStudentPages/StudentReport";
import StudentLayout from "./components/layout/StudentLayout";

function App() {
  // const userRole = useSelector((state) => state.auth.user.role);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin-dashboard");

  return (
    <div className={isAdminRoute ? "h-screen bg-surface-page" : "flex flex-col min-h-screen"}>
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? "h-full" : "flex-1"}>
        <Routes>
          {/* must have if else statement to handle 404 page if user play with slug or did not have permission to open specific page */}
          <Route path="/" exact element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pro" element={<Test />} />
          <Route path="/test" element={<ProfileComponent />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/student/report" element={<StudentReport />} /> */}
          <Route path="/student/courses" element={<StudentCourse />} />
          <Route path="/student/events" element={<StudentEvent />} />
          <Route path="/student/tickets" element={<Ticket />} />
          <Route path="/notes" element={<Note />} />
          <Route
            path="/student/achievements"
            element={<StudentAchievement />}
          />
          <Route
            path="/student/certificates"
            element={<StudentCertificate />}
          />
          <Route path="/student/difficulties" element={<Difficulties />} />
          <Route
            path="/student/scholarship-student-form"
            element={<ScholarshipStudentForm />}
          />
          <Route path="/try-report" element={<StudentLayout><StudentReport /></StudentLayout>} />
          <Route path="/try-report-list" element={<StudentReportList />} />
          <Route path="/universityDetails" element={<UniversityDetails />} />
          <Route path="/semester-list" element={<SemestersList />} />
          <Route path="/semester-create" element={<SemesterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/student/financial-report"
            element={<FinancialReport />}
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/student-report" element={<StudentReportPage />} />
          <Route path="/my-reports" element={<StudentReportList />} />
          <Route path="/student/details" element={<StudentDetails />} />

          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/ticket-list" element={<TicketList />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/users" element={<AllUsers />} />
          <Route path="/admin-dashboard/roles" element={<Roles />} />
          <Route path="/admin-dashboard/analytics" element={<Analytics />} />
          <Route path="/admin-dashboard/role-requests" element={<RoleRequestManager />} />
          <Route path="/admin-dashboard/reports" element={<AdminStudentReports />} />
          <Route path="/admin-dashboard/tickets" element={<AdminTickets />} />
          <Route path="/admin-dashboard/programs" element={<AdminProgramsHub />} />
          <Route path="/admin-dashboard/financial" element={<AdminFinancialOverview />} />
          <Route path="/admin-dashboard/scholarship" element={<AdminScholarshipHub />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
      {/* <Footer /> */}
      <ToastContainer />
    </div>
  );
}

export default App;
