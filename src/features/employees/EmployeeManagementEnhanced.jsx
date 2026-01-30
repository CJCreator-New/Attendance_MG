import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Upload, Download, BarChart3, FileText, Grid, List, FileSpreadsheet } from 'lucide-react';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/storage';
import { EmployeeDirectory } from './EmployeeDirectory';
import { EmployeeProfile } from './EmployeeProfile';
import { EmployeeAnalytics } from './EmployeeAnalytics';
import { BulkOperations } from './BulkOperations';
import { DocumentManager } from './DocumentManager';
import * as XLSX from 'xlsx';
import { useToastStore } from '../../stores/toastStore';
import { downloadEmployeeTemplate } from '../../utils/employeeTemplate';

export const EmployeeManagementEnhanced = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const showToast = useToastStore(state => state.addToast);

  useEffect(() => {
    const data = loadFromLocalStorage();
    if (data?.employees) setEmployees(data.employees);
  }, []);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      
      // Get current attendance data
      const currentData = loadFromLocalStorage();
      const currentMonth = currentData?.month || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Generate dates and days for current month
      const dates = [];
      const days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        dates.push(date.toISOString());
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
      
      const imported = data.map((row, idx) => ({
        sno: employees.length + idx + 1,
        empId: row['Employee ID'] || row.empId || `EMP${Date.now() + idx}`,
        name: row['Name'] || row.name || 'Unknown',
        gross: Number(row['Gross Salary'] || row.gross || 0),
        openingCL: Number(row['Opening CL'] || row.openingCL || 8),
        department: row['Department'] || row.department || 'General',
        designation: row['Designation'] || row.designation || 'Employee',
        email: row['Email'] || row.email || '',
        phone: row['Phone'] || row.phone || '',
        attendance: new Array(daysInMonth).fill(''),
        presentDays: 0,
        casualLeave: 0,
        weekOff: 0,
        paidHoliday: 0,
        onDuty: 0,
        lossOfPay: 0,
        payableDays: 0,
        earnedGross: 0,
        basic: 0,
        da: 0,
        hra: 0,
        bonus: 0,
        otherAllowance: 0,
        ot: 0,
        totalEarnings: 0,
        epf: 0,
        esi: 0,
        profTax: 0,
        otherDeduction: 0,
        totalDeduction: 0,
        netSalary: 0
      }));
      
      const updated = [...employees, ...imported];
      setEmployees(updated);
      
      // Save to localStorage with attendance structure
      const attendanceData = {
        month: currentMonth,
        employees: updated,
        dates: dates,
        days: days
      };
      saveToLocalStorage(attendanceData);
      showToast(`${imported.length} employees imported and added to attendance`, 'success');
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset input
  };

  const handleExport = () => {
    const data = employees.map(e => ({
      'Employee ID': e.empId,
      'Name': e.name,
      'Department': e.department || 'General',
      'Designation': e.designation || 'Employee',
      'Gross Salary': e.gross,
      'Email': e.email || '',
      'Phone': e.phone || '',
      'Opening CL': e.openingCL || 8
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'Employees.xlsx');
    showToast('Employees exported', 'success');
  };

  const tabs = [
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'bulk', label: 'Bulk Operations', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">{employees.length} employees</p>
          </div>
          <div className="flex gap-3">
            <button onClick={downloadEmployeeTemplate} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Download Template
            </button>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" id="import" />
            <label htmlFor="import" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import Excel
            </label>
            <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
          <div className="flex border-b border-gray-200 dark:border-neutral-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors relative ${
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
            {activeTab === 'directory' && (
              <EmployeeDirectory 
                employees={employees} 
                setEmployees={setEmployees}
                onSelectEmployee={setSelectedEmployee}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )}
            {activeTab === 'analytics' && <EmployeeAnalytics employees={employees} />}
            {activeTab === 'bulk' && <BulkOperations employees={employees} setEmployees={setEmployees} />}
            {activeTab === 'documents' && <DocumentManager employees={employees} />}
          </motion.div>
        </div>

        {selectedEmployee && (
          <EmployeeProfile 
            employee={selectedEmployee} 
            onClose={() => setSelectedEmployee(null)}
            onUpdate={(updated) => {
              const newEmps = employees.map(e => e.empId === updated.empId ? updated : e);
              setEmployees(newEmps);
              saveToLocalStorage({ employees: newEmps });
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
