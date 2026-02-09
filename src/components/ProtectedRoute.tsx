import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for admin-only pages.
 * Redirects to /login if not authenticated, or to / if authenticated but not admin.
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-chnebel-gray flex items-center justify-center">
        <div className="text-chnebel-black text-lg">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * No-op wrapper for public routes.
 * Public pages are accessible to everyone without login.
 */
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
