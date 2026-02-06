import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Settings, Calendar, Mail, Download, BarChart3, Layout, Loader2 } from 'lucide-react';
import { EmployeeService } from '../../services/employeeService';
import { AttendanceService } from '../../services/attendanceService';
import { MonthService } from '../../services/monthService';
import { useToastStore } from '../../stores/toastStore';
import { ReportTypes } from './ReportTypes';
import { CustomReportBuilder } from './CustomReportBuilder';
import { ScheduledReports } from './ScheduledReports';
import { ReportTemplates } from './ReportTemplates';
import { ReportAnalytics } from './ReportAnalytics';
import { ExportCenter } from './ExportCenter';

export const AdvancedReporting = () => {
  const [activeTab, setActiveTab] = useState('types');
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState(2026);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToastStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [employeesData, activeMonth] = await Promise.all([
        EmployeeService.getAllEmployees(),
        MonthService.getActiveMonth()
      ]);
      
      setEmployees(employeesData);
      if (activeMonth) {
        setMonth(activeMonth.month);
        setYear(activeMonth.year);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      addToast('Failed to load report data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'types', label: 'Report Types', icon: FileText },
    { id: 'builder', label: 'Custom Builder', icon: Settings },
    { id: 'scheduled', label: 'Scheduled Reports', icon: Calendar },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'export', label: 'Export Center', icon: Download }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Reporting</h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">Generate and manage comprehensive reports</p>
          </div>
          <div className="flex gap-3">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            >
              {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
          <div className="flex border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
          >
            {activeTab === 'types' && <ReportTypes employees={employees} month={month} year={year} />}
            {activeTab === 'builder' && <CustomReportBuilder employees={employees} />}
            {activeTab === 'scheduled' && <ScheduledReports />}
            {activeTab === 'templates' && <ReportTemplates employees={employees} />}
            {activeTab === 'analytics' && <ReportAnalytics employees={employees} />}
            {activeTab === 'export' && <ExportCenter employees={employees} month={month} year={year} />}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
