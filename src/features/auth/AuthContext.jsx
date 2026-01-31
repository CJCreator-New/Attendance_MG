import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import { sessionManager } from '../../utils/sessionManager';
import { AuditService } from '../../services/auditService';

const AuthContext = createContext(null);

const DEFAULT_PERMISSIONS = {
  canMarkAttendance: true,
  canProcessPayroll: true,
  canManageEmployees: true,
  canViewReports: true,
  canApproveLeaves: true,
  canManageSettings: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      sessionManager.start(() => {
        logout();
        alert('Session expired due to inactivity');
      });
    }
    return () => sessionManager.stop();
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.$id,
          email: currentUser.email,
          name: currentUser.name,
          role: currentUser.prefs?.role || 'Manager',
          permissions: currentUser.prefs?.permissions || DEFAULT_PERMISSIONS
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await AuthService.login(email, password);
      await checkAuth();
      await AuditService.logLogin(user?.id || 'unknown');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signup = async (email, password, name) => {
    try {
      await AuthService.createAccount(email, password, name);
      await login(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await AuditService.logLogout(user?.id || 'unknown');
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      sessionManager.stop();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
