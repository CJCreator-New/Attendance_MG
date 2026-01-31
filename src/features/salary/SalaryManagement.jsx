import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, TrendingUp, FileCheck, Download, Settings, Loader2 } from 'lucide-react';
import { EmployeeService } from '../../services/employeeService';
import { AttendanceService } from '../../services/attendanceService';
import { SalaryConfigService } from '../../services/salaryConfigService';
import { MonthService } from '../../services/monthService';
import { calculateSalary } from '../../utils/salaryCalculator';
import { SalaryBreakdown } from './SalaryBreakdown';
import { SalaryRegister } from './SalaryRegister';
import { PaySlipGenerator } from './PaySlipGenerator';
import { SalaryTrends } from './SalaryTrends';
import { TaxCalculator } from './TaxCalculator';
import { ComplianceReports } from './ComplianceReports';
import { SalaryComponentConfig } from './SalaryComponentConfig';
import { useToastStore } from '../../stores/toastStore';

export const SalaryManagement = () => {
  const [activeTab, setActiveTab] = useState('breakdown');
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToastStore(state => state.addToast);

  const loadSalaryData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get active month
      const activeMonth = await MonthService.getActiveMonth();
      if (!activeMonth) {
        showToast('No active month found', 'warning');
        setIsLoading(false);
        return;
      }

      // Get all employees
      const employeesData = await EmployeeService.getAllEmployees();
      
      // Get attendance for each employee
      const attendanceRecords = await AttendanceService.getAllAttendanceForMonth(activeMonth.$id);
      
      // Get salary configs
      const salaryConfigs = await SalaryConfigService.getAllSalaryConfigs();
      
      // Combine data and calculate salaries
      const enrichedEmployees = employeesData.map(emp => {
        const attendance = attendanceRecords.find(a => a.employeeId === emp.empId);
        const salaryConfig = salaryConfigs.find(s => s.employeeId === emp.empId);
        
        const attendanceArray = attendance?.attendance || [];
        const calculated = calculateSalary(emp, attendanceArray);
        
        return {
          ...emp,
          attendance: attendanceArray,
          presentDays: attendance?.presentDays || 0,
          paidHoliday: attendance?.paidHoliday || 0,
          weekOff: attendance?.weekOff || 0,
          onDuty: attendance?.onDuty || 0,
          casualLeave: attendance?.casualLeave || 0,
          lossOfPay: attendance?.lossOfPay || 0,
          payableDays: attendance?.payableDays || 0,
          bonus: salaryConfig?.bonus || 0,
          otherAllowance: salaryConfig?.otherAllowance || 0,
          ot: salaryConfig?.ot || 0,
          otherDeduction: salaryConfig?.otherDeduction || 0,
          ...calculated
        };
      });
      
      setEmployees(enrichedEmployees);
    } catch (error) {
      showToast('Failed to load salary data: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadSalaryData();
  }, [loadSalaryData]);

  const tabs = [
    { id: 'breakdown', label: 'Salary Breakdown', icon: Calculator },
    { id: 'register', label: 'Salary Register', icon: FileText },
    { id: 'payslips', label: 'Pay Slips', icon: FileCheck },
    { id: 'trends', label: 'Salary Trends', icon: TrendingUp },
    { id: 'tax', label: 'Tax Calculator', icon: Calculator },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
    { id: 'config', label: 'Configuration', icon: Settings }
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const totalGross = employees.reduce((sum, emp) => sum + (emp.gross || 0), 0);
  const totalEarnings = employees.reduce((sum, emp) => sum + (emp.totalEarnings || 0), 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + (emp.totalDeduction || 0), 0);
  const totalNet = employees.reduce((sum, emp) => sum + (emp.netSalary || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600 dark:text-neutral-400">Loading salary data...</p>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Salary Management</h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">
              {isLoading ? 'Loading...' : `Complete salary processing for ${employees.length} employees`}
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            >
              {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Gross', value: totalGross, color: 'blue' },
            { label: 'Total Earnings', value: totalEarnings, color: 'green' },
            { label: 'Total Deductions', value: totalDeductions, color: 'red' },
            { label: 'Net Payable', value: totalNet, color: 'purple' }
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-${metric.color}-50 dark:bg-${metric.color}-900/20 p-6 rounded-lg`}
            >
              <p className="text-sm text-gray-600 dark:text-neutral-400">{metric.label}</p>
              <p className={`text-2xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400 mt-1`}>
                ₹{metric.value.toLocaleString('en-IN')}
              </p>
            </motion.div>
          ))}
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
            {activeTab === 'breakdown' && <SalaryBreakdown employees={employees} />}
            {activeTab === 'register' && <SalaryRegister employees={employees} month={selectedMonth} year={selectedYear} />}
            {activeTab === 'payslips' && <PaySlipGenerator employees={employees} month={selectedMonth} year={selectedYear} />}
            {activeTab === 'trends' && <SalaryTrends employees={employees} />}
            {activeTab === 'tax' && <TaxCalculator employees={employees} />}
            {activeTab === 'compliance' && <ComplianceReports employees={employees} month={selectedMonth} year={selectedYear} />}
            {activeTab === 'config' && <SalaryComponentConfig />}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
