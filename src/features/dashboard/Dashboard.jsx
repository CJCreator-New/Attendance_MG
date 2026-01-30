import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MetricsCards } from './MetricsCards';
import { AttendanceTrendChart } from './AttendanceTrendChart';
import { DepartmentChart } from './DepartmentChart';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { Announcements } from './Announcements';
import { fadeIn, containerVariants } from '../../animations/variants';
import { STORAGE_KEYS } from '../../constants/storageKeys';

export const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_DATA);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setData(null);
      }
    }
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

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
    </motion.div>
  );
};
