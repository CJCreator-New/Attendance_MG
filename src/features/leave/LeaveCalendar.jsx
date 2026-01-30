import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Calendar } from 'lucide-react';

export const LeaveCalendar = ({ applications }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const getLeavesForDay = (day) => {
    return applications.filter(app => {
      const from = new Date(app.fromDate);
      const to = new Date(app.toDate);
      const current = new Date(currentYear, currentMonth, day);
      return current >= from && current <= to && app.status === 'Approved';
    });
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold">Leave Calendar</h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-center p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">{day}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const leaves = getLeavesForDay(i + 1);
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`border rounded p-2 min-h-[60px] ${\
                leaves.length > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300' : 'border-gray-200'\
              }`}
            >
              <div className="font-semibold text-sm">{i + 1}</div>
              {leaves.length > 0 && (
                <div className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                  {leaves.length} on leave
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
