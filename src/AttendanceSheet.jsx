import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FileSpreadsheet, ArrowUpDown, LayoutGrid, User, BarChart3 } from 'lucide-react';
import { CalendarView } from './features/attendance/CalendarView';
import { IndividualView } from './features/attendance/IndividualView';
import { LeaveAnalytics } from './features/leave/LeaveAnalytics';
import { parseAttendanceExcel } from './utils/excelParser';
import { exportToExcel } from './utils/excelExport';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';
import { sortEmployees } from './utils/sorting';
import { validateAttendanceUpdate } from './utils/validation';
import { calculateSalary } from './utils/salaryCalculator';
import { Toast, useToast } from './components/Toast';
import { EmployeeModal } from './components/EmployeeModal';
import { AttendanceOnlyRow } from './components/AttendanceOnlyRow';
import { SummaryReport } from './components/SummaryReport';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AttendanceHeader } from './components/AttendanceHeader';
import { MobileAttendanceView } from './components/MobileAttendanceView';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmptyState } from './components/EmptyState';
import { SALARY_CONSTANTS, ATTENDANCE_CODES } from './constants';
import { LIMITS, UI_CONSTANTS } from './constants/uiConstants';
import './print.css';

const AttendanceSheet = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [sortBy, setSortBy] = useState('sno');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('table'); // 'table', 'calendar', 'individual', 'analytics'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { toasts, showToast } = useToast();

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData && savedData.employees) {
      setData(savedData);
    } else {
      // Initialize with empty structure
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const dates = [];
      const days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        dates.push(date.toISOString());
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
      
      setData({
        month: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        employees: [],
        dates,
        days
      });
    }
  }, []);

  const updateAttendance = useCallback((empId, dateIndex, value) => {
    const validation = validateAttendanceUpdate(empId, dateIndex, value, data.dates);
    if (!validation.isValid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    setData(prevData => {
      const newEmployees = prevData.employees.map(emp => {
        if (emp.empId === empId) {
          const newAttendance = [...emp.attendance];
          // Ensure array length matches dates
          while (newAttendance.length < prevData.dates.length) {
            newAttendance.push('');
          }
          newAttendance[dateIndex] = value;
          const calculated = calculateSalary(emp, newAttendance);
          return { ...emp, attendance: newAttendance, ...calculated };
        }
        return emp;
      });
      
      setHasChanges(true);
      return { ...prevData, employees: newEmployees };
    });
  }, [data?.dates, showToast]);

  const toggleEdit = (empId, dateIndex) => {
    const key = `${empId}-${dateIndex}`;
    setEditMode(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCellColor = useCallback((status) => {
    const colors = {
      'P': 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900',
      'A': 'bg-rose-100 hover:bg-rose-200 text-rose-900',
      'CL': 'bg-amber-100 hover:bg-amber-200 text-amber-900',
      'HCL': 'bg-orange-100 hover:bg-orange-200 text-orange-900',
      'HP': 'bg-teal-100 hover:bg-teal-200 text-teal-900',
      'HL': 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900',
      'WO': 'bg-slate-100 hover:bg-slate-200 text-slate-900',
      'WW': 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      'PH': 'bg-violet-100 hover:bg-violet-200 text-violet-900',
      'pH': 'bg-purple-100 hover:bg-purple-200 text-purple-900',
      'PHW': 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900',
      'OD': 'bg-cyan-100 hover:bg-cyan-200 text-cyan-900',
      'WFH': 'bg-blue-100 hover:bg-blue-200 text-blue-900'
    };
    return colors[status] || 'bg-white hover:bg-gray-50';
  }, []);

  const formatCurrency = useCallback((amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  const formatNumber = useCallback((num) => {
    if (!num && num !== 0) return '-';
    return num;
  }, []);

  const saveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      const result = saveToLocalStorage(data);
      if (result.success) {
        showToast('Changes saved successfully!', 'success');
        setHasChanges(false);
      } else {
        showToast(result.error || 'Failed to save changes', 'error');
      }
      setIsSaving(false);
    }, 300);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const parsedData = await parseAttendanceExcel(file);
      setData(parsedData);
      setHasChanges(false);
      showToast('Excel file loaded successfully!', 'success');
    } catch (error) {
      showToast('Error reading Excel file: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      exportToExcel(data);
      showToast('Excel file exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export Excel file', 'error');
    }
  };

  const addEmployee = (empData) => {
    if (data.employees.length >= LIMITS.MAX_EMPLOYEES) {
      showToast(`Maximum limit of ${LIMITS.MAX_EMPLOYEES} employees reached`, 'error');
      return;
    }

    if (data.employees.some(e => e.empId === empData.empId)) {
      showToast('Employee ID already exists', 'error');
      return;
    }

    const newEmployee = {
      sno: data.employees.length + 1,
      ...empData,
      openingCL: empData.openingCL || 8,
      attendance: new Array(data.dates.length).fill(''),
      presentDays: 0,
      paidHoliday: 0,
      weekOff: 0,
      onDuty: 0,
      casualLeave: 0,
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
    };

    setData({ ...data, employees: [...data.employees, newEmployee] });
    setShowEmployeeModal(false);
    setHasChanges(true);
    showToast('Employee added successfully', 'success');
  };

  const bulkAddEmployees = (employeesData) => {
    const existingIds = new Set(data.employees.map(e => e.empId));
    const duplicates = [];
    const newEmployees = [];
    
    employeesData.forEach((emp, idx) => {
      if (existingIds.has(emp.empId)) {
        duplicates.push(emp.empId);
      } else {
        existingIds.add(emp.empId);
        newEmployees.push({
          sno: data.employees.length + newEmployees.length + 1,
          empId: emp.empId,
          name: emp.name,
          gross: emp.gross,
          openingCL: emp.openingCL || 8,
          attendance: new Array(data.dates.length).fill(''),
          presentDays: 0,
          paidHoliday: 0,
          weekOff: 0,
          onDuty: 0,
          casualLeave: 0,
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
        });
      }
    });

    if (newEmployees.length > 0) {
      setData({ ...data, employees: [...data.employees, ...newEmployees] });
      setHasChanges(true);
      const message = duplicates.length > 0 
        ? `${newEmployees.length} added, ${duplicates.length} skipped (duplicate IDs: ${duplicates.slice(0, UI_CONSTANTS.MAX_DUPLICATE_DISPLAY).join(', ')}${duplicates.length > UI_CONSTANTS.MAX_DUPLICATE_DISPLAY ? '...' : ''})`
        : `${newEmployees.length} employees added successfully`;
      showToast(message, duplicates.length > 0 ? 'warning' : 'success');
    } else {
      showToast('All employee IDs already exist', 'error');
    }
  };

  const bulkDeleteEmployees = (empIds) => {
    const newEmployees = data.employees.filter(e => !empIds.includes(e.empId));
    setData({ ...data, employees: newEmployees });
    setHasChanges(true);
    showToast(`${empIds.length} employees deleted successfully`, 'success');
  };

  const updateEmployee = (empData) => {
    const newEmployees = data.employees.map(emp => {
      if (emp.empId === empData.empId) {
        const calculated = calculateSalary({ ...emp, ...empData }, emp.attendance);
        return { ...emp, ...empData, ...calculated };
      }
      return emp;
    });

    setData({ ...data, employees: newEmployees });
    setShowEmployeeModal(false);
    setEditingEmployee(null);
    setHasChanges(true);
    showToast('Employee updated successfully', 'success');
  };

  const deleteEmployee = (empId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Employee',
      message: 'Are you sure you want to delete this employee? This action cannot be undone.',
      onConfirm: () => {
        const newEmployees = data.employees.filter(e => e.empId !== empId);
        setData({ ...data, employees: newEmployees });
        setHasChanges(true);
        showToast('Employee deleted successfully', 'success');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  const handleBulkUpdate = useCallback((dateIndices, status) => {
    const newEmployees = data.employees.map(emp => {
      const newAttendance = [...emp.attendance];
      dateIndices.forEach(idx => {
        newAttendance[idx] = status;
      });
      const calculated = calculateSalary(emp, newAttendance);
      return { ...emp, attendance: newAttendance, ...calculated };
    });

    setData({ ...data, employees: newEmployees });
    setHasChanges(true);
    showToast(`Bulk update applied to ${dateIndices.length} day(s)`, 'success');
  }, [data, showToast]);

  const filteredEmployees = useMemo(() => {
    if (!data?.employees) return [];
    return data.employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.employees, searchTerm]);

  const sortedEmployees = useMemo(() => 
    sortEmployees(filteredEmployees, sortBy, sortOrder),
    [filteredEmployees, sortBy, sortOrder]
  );

  const handleSort = useCallback((column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  const handlePrint = () => {
    window.print();
  };

  const handleViewEmployee = useCallback((employee) => {
    setSelectedEmployee(employee);
    setViewMode('individual');
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          if (hasChanges) saveChanges();
        } else if (e.key === 'e') {
          e.preventDefault();
          handleExport();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasChanges, data]);

  if (!data || !data.employees || !data.dates) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          {isLoading ? (
            <LoadingSpinner size="lg" text="Loading attendance data..." />
          ) : (
            <>
              <FileSpreadsheet className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600">No attendance data available. Please add employees from Employee Management.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gray-50">
      <Toast toasts={toasts} />
      {(isLoading || isSaving) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <LoadingSpinner size="lg" text={isSaving ? 'Saving changes...' : 'Loading...'} />
          </div>
        </div>
      )}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {hasChanges && "Attendance updated. Remember to save changes."}
      </div>
      
      <AttendanceHeader
        month={data.month}
        employeeCount={data.employees.length}
        filteredCount={sortedEmployees.length}
        hasChanges={hasChanges}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMonthChange={(month) => setData({ ...data, month })}
        onSave={saveChanges}
        onExport={handleExport}
        onImport={handleFileUpload}
        onAddEmployee={() => { setEditingEmployee(null); setShowEmployeeModal(true); }}
        onShowSummary={() => setShowSummary(true)}
        onPrint={handlePrint}
        onBulkUpdate={handleBulkUpdate}
        onBulkAddEmployees={bulkAddEmployees}
        onBulkDeleteEmployees={bulkDeleteEmployees}
        employees={data.employees}
        dates={data.dates}
        days={data.days}
        fileInputRef={fileInputRef}
      />

      <div className="bg-white border-b border-gray-200 px-6 py-3 flex gap-2 no-print">
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          aria-label="Switch to table view"
          aria-pressed={viewMode === 'table'}
        >
          <span className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" aria-hidden="true" /> Table View</span>
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          aria-label="Switch to calendar view"
          aria-pressed={viewMode === 'calendar'}
        >
          <span className="flex items-center gap-2"><LayoutGrid className="w-4 h-4" aria-hidden="true" /> Calendar View</span>
        </button>
        <button
          onClick={() => setViewMode('analytics')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          aria-label="Switch to analytics view"
          aria-pressed={viewMode === 'analytics'}
        >
          <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" aria-hidden="true" /> Leave Analytics</span>
        </button>
      </div>

      {viewMode === 'calendar' && (
        <CalendarView
          employees={sortedEmployees}
          month={new Date(data.dates[0]).getMonth()}
          year={new Date(data.dates[0]).getFullYear()}
          onUpdateAttendance={updateAttendance}
        />
      )}

      {viewMode === 'individual' && selectedEmployee && (
        <IndividualView
          employee={selectedEmployee}
          onUpdateAttendance={updateAttendance}
          onBack={() => setViewMode('table')}
        />
      )}

      {viewMode === 'analytics' && (
        <LeaveAnalytics employees={sortedEmployees} />
      )}

      <MobileAttendanceView
        employees={sortedEmployees}
        formatCurrency={formatCurrency}
        getCellColor={getCellColor}
        onEdit={(emp) => { setEditingEmployee(emp); setShowEmployeeModal(true); }}
        onDelete={deleteEmployee}
        onUpdateAttendance={updateAttendance}
        dates={data.dates}
        days={data.days}
      />

      {viewMode === 'table' && (
      <div className="relative overflow-auto hidden md:block">
        <div className="scroll-shadow-left" />
        <div className="scroll-shadow-right" />
        <table className="attendance-table w-full border-collapse bg-white" style={{ minWidth: '2000px' }} role="grid" aria-label="Employee attendance sheet">
          <thead className="sticky top-[145px] z-40 bg-blue-600 text-white">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-left" rowSpan={2}>
                <button onClick={() => handleSort('sno')} className="flex items-center gap-1" aria-label="Sort by serial number">
                  S.NO <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-left" rowSpan={2}>
                <button onClick={() => handleSort('empId')} className="flex items-center gap-1" aria-label="Sort by employee ID">
                  Emp ID <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-left" rowSpan={2}>
                <button onClick={() => handleSort('name')} className="flex items-center gap-1" aria-label="Sort by name">
                  Name <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-right" rowSpan={2}>
                <button onClick={() => handleSort('gross')} className="flex items-center gap-1" aria-label="Sort by gross salary">
                  Gross <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-center" colSpan={7}>Attendance Summary</th>
              {data.dates.map((date, idx) => (
                <th key={idx} className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[50px]">
                  {new Date(date).getDate()}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold">Present</th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold">PH</th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold">WO</th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold">OD</th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold">CL</th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold">LOP</th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold">Payable</th>
              {data.days.map((day, idx) => (
                <th key={idx} className="border border-gray-300 px-2 py-1 text-xs font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedEmployees.length === 0 ? (
              <tr>
                <td colSpan="100" className="p-8">
                  <EmptyState
                    icon={User}
                    title="No Employees Found"
                    message="No employees match your search criteria. Try adjusting your filters or add new employees."
                    action={() => { setEditingEmployee(null); setShowEmployeeModal(true); }}
                    actionText="Add Employee"
                  />
                </td>
              </tr>
            ) : (
              sortedEmployees.map((employee) => (
                <AttendanceOnlyRow
                  key={employee.empId}
                  employee={employee}
                  formatNumber={formatNumber}
                  getCellColor={getCellColor}
                  editMode={editMode}
                  onEdit={(emp) => { setEditingEmployee(emp); setShowEmployeeModal(true); }}
                  onDelete={deleteEmployee}
                  onToggleEdit={toggleEdit}
                  onUpdateAttendance={updateAttendance}
                  onViewEmployee={() => handleViewEmployee(employee)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      )}

      {viewMode === 'table' && (
      <div className="bg-white border-t border-gray-200 px-6 py-4 text-sm text-gray-600 no-print">
        <p>Total Employees: {sortedEmployees.length} | Click on any attendance cell to edit | Changes are automatically calculated</p>
      </div>
      )}

      {showEmployeeModal && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={editingEmployee ? updateEmployee : addEmployee}
          onClose={() => { setShowEmployeeModal(false); setEditingEmployee(null); }}
        />
      )}

      {showSummary && (
        <SummaryReport
          employees={data.employees}
          onClose={() => setShowSummary(false)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
    </ErrorBoundary>
  );
};

export default AttendanceSheet;
