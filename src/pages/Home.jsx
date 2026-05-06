import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Login from './Login';
import Waiting from './Waiting';

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user); // Select the user object

  // Check if user is null before accessing role
  const userRole = user ? user.role : null; // Safely access user.role

  if (isLoggedIn) {
    switch (userRole) {
      case 'Admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'Employee':
        return <Navigate to="/employee-dashboard" replace />;
      case 'Scholarship Student':
        return <Navigate to="/student-dashboard" replace />;
      case 'Institute Student':
        return <Navigate to="/student-dashboard" replace />;
      case 'User':
        return <Waiting />;
      default:
        return <Waiting />;
    }
  }

  return <Login />;
};

export default Home;
