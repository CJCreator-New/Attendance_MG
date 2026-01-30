import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ATTENDANCE_CODE_COLORS, ATTENDANCE_CODES } from '../../constants';
import { Card } from '../../components/ui/Card';
import { ChevronLeft, ChevronRight, TrendingUp, AlertCircle } from 'lucide-react';
import { itemVariants } from '../../animations/variants';

export const CalendarView = ({ employees, month, year, onUpdateAttendance }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const getStatusColor = (status) => {
    return ATTENDANCE_CODE_COLORS[status] || 'bg-gray-50';
  };

  const getDayStats = (dayIndex) => {
    const present = employees.filter(e => e.attendance[dayIndex] === 'P').length;
    const absent = employees.filter(e => e.attendance[dayIndex] === 'A').length;
    const leave = employees.filter(e => ['CL', 'HCL'].includes(e.attendance[dayIndex])).length;
    return { present, absent, leave, total: employees.length };
  };

  const isWeekend = (dayIndex) => {
    const date = new Date(year, month, dayIndex + 1);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const isHoliday = (dayIndex) => {
    const holidays = JSON.parse(localStorage.getItem('holidays') || '[]');
    const date = new Date(year, month, dayIndex + 1).toISOString().split('T')[0];
    return holidays.some(h => h.date === date);
  };

  return (
    <div className="space-y-4">
      {/* Status Selector */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Quick Mark</h3>
          <div className="flex gap-2">
            {Object.entries(ATTENDANCE_CODES).slice(0, 6).map(([key, label]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStatus(selectedStatus === key ? null : key)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  selectedStatus === key ? 'ring-2 ring-blue-500' : ''
                } ${getStatusColor(key)}`}
              >
                {key}
              </motion.button>
            ))}
          </div>
        </div>
        {selectedStatus && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Click on any day to mark as {selectedStatus}
          </div>
        )}
      </Card>

      {/* Calendar */}
      <Card>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">{day}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="border border-transparent" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const stats = getDayStats(i);
            const weekend = isWeekend(i);
            const holiday = isHoliday(i);
            
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                onMouseEnter={() => setHoveredDay(i)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`border rounded p-2 min-h-[120px] transition-all cursor-pointer ${
                  weekend ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'border-gray-200'
                } ${
                  holiday ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300' : ''
                } ${
                  hoveredDay === i ? 'shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-lg text-gray-700 dark:text-gray-300">{i + 1}</div>
                  {holiday && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                </div>
                
                {/* Stats Bar */}
                <div className="flex gap-1 mb-2">
                  <div className="flex-1 h-1 bg-green-500 rounded" style={{ width: `${(stats.present/stats.total)*100}%` }} />
                  <div className="flex-1 h-1 bg-red-500 rounded" style={{ width: `${(stats.absent/stats.total)*100}%` }} />
                </div>

                <div className="space-y-1 max-h-[60px] overflow-y-auto">
                  {employees.slice(0, 6).map(emp => (
                    <div 
                      key={emp.empId} 
                      className={`text-xs px-2 py-1 rounded font-semibold cursor-pointer transition-transform hover:scale-105 ${
                        getStatusColor(emp.attendance[i])
                      }`}
                      onClick={() => {
                        if (selectedStatus) {
                          onUpdateAttendance(emp.empId, i, selectedStatus);
                        }
                      }}
                      title={`${emp.name}: ${emp.attendance[i] || 'Not marked'}`}
                    >
                      {emp.attendance[i] || '-'}
                    </div>
                  ))}
                  {employees.length > 6 && (
                    <div className="text-xs text-gray-500 px-2">+{employees.length - 6} more</div>
                  )}
                </div>
                
                {hoveredDay === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t"
                  >
                    P:{stats.present} A:{stats.absent} L:{stats.leave}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Patterns Analysis */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold">Attendance Patterns</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((employees.reduce((sum, e) => sum + (e.presentDays || 0), 0) / employees.length / daysInMonth) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
            <div className="text-2xl font-bold text-red-600">
              {employees.filter(e => (e.lossOfPay || 0) > 5).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Absenteeism</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {employees.reduce((sum, e) => sum + (e.casualLeave || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Leaves</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {Array.from({ length: daysInMonth }).filter((_, i) => isWeekend(i) || isHoliday(i)).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Holidays</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
