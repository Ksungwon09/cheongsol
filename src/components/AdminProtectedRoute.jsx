import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    // Optional: Redirect non-admins to a "Not Authorized" page
    // For now, redirecting to home.
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtectedRoute;
