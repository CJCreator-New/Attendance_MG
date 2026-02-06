import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { EmployeeService } from '../../services/employeeService';
import { AttendanceService } from '../../services/attendanceService';
import { MonthService } from '../../services/monthService';
import { LeaveService } from '../../services/leaveService';
import { MetricsCards } from './MetricsCards';
import { AttendanceTrendChart } from './AttendanceTrendChart';
import { DepartmentChart } from './DepartmentChart';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { Announcements } from './Announcements';
import { fadeIn, containerVariants } from '../../animations/variants';
import { useToastStore } from '../../stores/toastStore';
import { useRealtimeAttendance } from '../../hooks/useRealtimeAttendance';
import { LiveIndicator } from '../../components/LiveIndicator';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const showToast = useToastStore(state => state.addToast);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load all data in parallel
      const [employees, activeMonth, leaves] = await Promise.all([
        EmployeeService.getAllEmployees(),
        MonthService.getActiveMonth(),
        LeaveService.getAllLeaves()
      ]);

      if (!activeMonth) {
        showToast('No active month found', 'warning');
        setData({ employees: [], dates: [], days: [], leaves: [] });
        return;
      }

      // Get attendance for all employees
      const attendanceRecords = await AttendanceService.getAllAttendanceForMonth(activeMonth.$id);

      // Enrich employees with attendance data
      const enrichedEmployees = employees.map(emp => {
        const attendance = attendanceRecords.find(a => a.employeeId === emp.empId);
        return {
          ...emp,
          attendance: attendance?.attendance || [],
          presentDays: attendance?.presentDays || 0,
          paidHoliday: attendance?.paidHoliday || 0,
          weekOff: attendance?.weekOff || 0,
          onDuty: attendance?.onDuty || 0,
          casualLeave: attendance?.casualLeave || 0,
          lossOfPay: attendance?.lossOfPay || 0,
          payableDays: attendance?.payableDays || 0
        };
      });

      setData({
        employees: enrichedEmployees,
        dates: activeMonth.dates,
        days: activeMonth.days,
        month: activeMonth.month,
        leaves: leaves
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Check if error is due to missing collection
      if (error.message?.includes('Collection with the requested ID')) {
        showToast('Database setup incomplete. Please run setup scripts.', 'warning');
      } else {
        showToast('Failed to load dashboard: ' + error.message, 'error');
      }
      setData({ employees: [], dates: [], days: [], leaves: [] });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useRealtimeAttendance(() => {
    setLastUpdate(new Date().toISOString());
    setIsRealtimeConnected(true);
    loadDashboardData();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.employees) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No data available. Please add employees and mark attendance.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...fadeIn} className="p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold"
      >
        Dashboard
      </motion.h1>
      <MetricsCards employees={data.employees} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AttendanceTrendChart employees={data.employees} />
        <DepartmentChart employees={data.employees} />
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity employees={data.employees} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <Announcements />
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <LiveIndicator isConnected={isRealtimeConnected} lastUpdate={lastUpdate} />
      </div>
    </motion.div>
  );
};
