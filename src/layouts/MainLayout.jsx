import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import { LayoutDashboard, Calendar, Umbrella, DollarSign, Users, FileText, Settings, LogOut, Building2, MapPin, Clock, GitBranch } from 'lucide-react';
import { ThemeToggle } from '../features/settings/ThemeToggle';
import { pageVariants } from '../animations/variants';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, path: '/attendance' },
    { id: 'leave', label: 'Leave', icon: Umbrella, path: '/leave' },
    { id: 'salary', label: 'Salary', icon: DollarSign, path: '/salary', permission: 'canProcessPayroll' },
    { id: 'employees', label: 'Employees', icon: Users, path: '/employees', permission: 'canManageEmployees' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    { id: 'tenants', label: 'Tenants', icon: Building2, path: '/tenants', permission: 'canManageSettings' },
    { id: 'branches', label: 'Branches', icon: MapPin, path: '/branches', permission: 'canManageSettings' },
    { id: 'shifts', label: 'Shifts', icon: Clock, path: '/shifts', permission: 'canManageSettings' },
    { id: 'workflows', label: 'Workflows', icon: GitBranch, path: '/workflows', permission: 'canManageSettings' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', permission: 'canManageSettings' }
  ];

  const visibleTabs = tabs.filter(tab => !tab.permission || user.permissions[tab.permission]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Attendance Management System</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name} ({user.role})</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <nav className="px-6 flex gap-1 overflow-x-auto scrollbar-hide">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <motion.button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap relative ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </header>

      <main className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
