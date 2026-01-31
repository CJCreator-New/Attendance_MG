import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  const value = {
    user,
    setUser,
    theme,
    setTheme,
    notifications,
    addNotification: (notification) => {
      setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
    },
    removeNotification: (id) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filters, setFilters] = useState({});

  const value = {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    filters,
    setFilters,
  };

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) throw new Error('useAttendance must be used within AttendanceProvider');
  return context;
};
