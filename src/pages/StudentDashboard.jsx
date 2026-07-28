import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ScholarshipStudentDashboard from './scholarshipStudentPages/ScholarshipStudentDashboard';
import InstituteStudentDash from './InstituteStudentDash/InstituteStudentDash';
import Loading from '../components/ui/Loading';
import { isInstituteStudentUser } from '../constants/institute';

const StudentDashboard = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Loading />;

  if (user.role === 'Scholarship Student') {
    return <ScholarshipStudentDashboard />;
  }

  // Institute students get the full institute portal (announcements, results,
  // courses, ideas, achievements, leave, correspondence, fees, …).
  if (isInstituteStudentUser(user)) {
    return <Navigate to="/institute-portal" replace />;
  }

  return <InstituteStudentDash />;
};

export default StudentDashboard;
