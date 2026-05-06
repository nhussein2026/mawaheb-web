import React from 'react';
import { useSelector } from 'react-redux';
import ScholarshipStudentDashboard from './scholarshipStudentPages/ScholarshipStudentDashboard';
import InstituteStudentDash from './InstituteStudentDash/InstituteStudentDash';
import Loading from '../components/ui/Loading';

const StudentDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  
  if (!user) return <Loading />;
  
  if (user.role === 'Scholarship Student') {
    return <ScholarshipStudentDashboard />;
  }
  
  return <InstituteStudentDash />;
};

export default StudentDashboard;
