import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !user?.permissions?.[requiredPermission]) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};
