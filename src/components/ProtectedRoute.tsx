import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // No authentication checks for frontend-only mode
  return <>{children}</>;
};

