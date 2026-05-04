import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Login from './Login';
import ScholarshipStudentDashboard from './scholarshipStudentPages/ScholarshipStudentDashboard';
import EmployeeDashboard from './employeeDashboard/EmployeeDashboard';
import Waiting from './Waiting';
import InstituteStudentDash from './InstituteStudentDash/InstituteStudentDash';

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user); // Select the user object

  // Check if user is null before accessing role
  const userRole = user ? user.role : null; // Safely access user.role

  console.log("this is userRole", userRole);

  return (
    <div>
      {isLoggedIn ? (
        <>
          {userRole === 'Admin' && <Navigate to="/admin-dashboard" replace />}
          {userRole === 'User' && <Waiting />}
          {userRole === 'Employee' && <EmployeeDashboard />}
          {userRole === 'Scholarship Student' && <ScholarshipStudentDashboard />}
          {userRole === 'Institute Student' && <InstituteStudentDash />}
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Home;
