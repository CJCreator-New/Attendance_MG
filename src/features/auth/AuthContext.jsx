import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    const users = {
      'manager@company.com': {
        id: 'user_001',
        username: 'manager@company.com',
        role: 'Manager',
        name: 'John Manager',
        companyId: 'company_001',
        branchId: 'branch_001',
        permissions: {
          canMarkAttendance: true,
          canProcessPayroll: false,
          canManageEmployees: false,
          canViewReports: true,
          canApproveLeaves: true,
          canManageSettings: false
        }
      },
      'hr@company.com': {
        id: 'user_002',
        username: 'hr@company.com',
        role: 'HR',
        name: 'Jane HR',
        companyId: 'company_001',
        branchId: 'branch_001',
        permissions: {
          canMarkAttendance: true,
          canProcessPayroll: true,
          canManageEmployees: true,
          canViewReports: true,
          canApproveLeaves: true,
          canManageSettings: true
        }
      }
    };

    const foundUser = users[username];
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
