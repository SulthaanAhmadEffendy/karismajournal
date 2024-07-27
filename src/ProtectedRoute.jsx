import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token');

  if (!isLoggedIn) {
    return <Navigate to='/auth/sign-in' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
