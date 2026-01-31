import { create } from 'zustand';
import { SALARY_CONSTANTS } from '../constants';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { calculateAttendanceSummary, calculateSalary } from '../utils/salaryCalculator';
import { createBackup } from '../utils/storage';

let updateLock = false;

export const useDataStore = create((set, get) => ({
  employees: [],
  leaveApplications: [],
  salaryRecords: [],
  selectedMonth: null,
  selectedYear: null,
  
  initializeData: (data) => {
    const uniqueIds = new Set();
    const validEmployees = (data.employees || []).filter(emp => {
      if (uniqueIds.has(emp.empId)) {
        console.warn(`Duplicate employee ID: ${emp.empId}`);
        return false;
      }
      uniqueIds.add(emp.empId);
      return true;
    });
    
    set({ 
      employees: validEmployees,
      selectedMonth: data.month,
      selectedYear: data.year
    });
    get().syncAllModules();
  },
  
  updateAttendance: (empId, dateIndex, value) => {
    if (updateLock) return;
    updateLock = true;
    
    set(state => {
      const employees = state.employees.map(emp => {
        if (emp.empId === empId) {
          const newAttendance = [...emp.attendance];
          newAttendance[dateIndex] = value;
          const calculated = calculateSalary(emp, newAttendance);
          return { ...emp, attendance: newAttendance, ...calculated };
        }
        return { ...emp };
      });
      
      const salaryRecords = employees.map(emp => ({
        empId: emp.empId,
        month: state.selectedMonth || new Date().toLocaleString('default', { month: 'long' }),
        year: state.selectedYear || new Date().getFullYear(),
        ...calculateSalary(emp, emp.attendance)
      }));
      
      updateLock = false;
      return { employees, salaryRecords };
    });
    get().persistData();
  },
  
  bulkUpdateAttendance: (employeeIds, dateIndices, status) => {
    if (updateLock) return;
    updateLock = true;
    
    set(state => {
      const employees = state.employees.map(emp => {
        if (employeeIds.length === 0 || employeeIds.includes(emp.empId)) {
          const newAttendance = [...emp.attendance];
          dateIndices.forEach(idx => { newAttendance[idx] = status; });
          const calculated = calculateSalary(emp, newAttendance);
          return { ...emp, attendance: newAttendance, ...calculated };
        }
        return { ...emp };
      });
      
      const salaryRecords = employees.map(emp => ({
        empId: emp.empId,
        month: state.selectedMonth || new Date().toLocaleString('default', { month: 'long' }),
        year: state.selectedYear || new Date().getFullYear(),
        ...calculateSalary(emp, emp.attendance)
      }));
      
      updateLock = false;
      return { employees, salaryRecords };
    });
    get().persistData();
  },
  
  syncLeaveBalances: () => {
    set(state => {
      const employees = state.employees.map(emp => {
        const summary = calculateAttendanceSummary(emp.attendance);
        return { ...emp, casualLeave: summary.casualLeave };
      });
      return { employees };
    });
  },
  
  syncSalaryRecords: () => {
    const { employees, selectedMonth, selectedYear } = get();
    const salaryRecords = employees.map(emp => ({
      empId: emp.empId,
      month: selectedMonth || new Date().toLocaleString('default', { month: 'long' }),
      year: selectedYear || new Date().getFullYear(),
      ...calculateSalary(emp, emp.attendance)
    }));
    set({ salaryRecords });
  },
  
  syncAllModules: () => {
    get().syncLeaveBalances();
    get().syncSalaryRecords();
    get().persistData();
  },
  
  applyLeave: (application) => {
    set(state => ({ leaveApplications: [...state.leaveApplications, application] }));
  },
  
  updateLeaveStatus: (appId, status) => {
    set(state => {
      const leaveApplications = state.leaveApplications.map(app =>
        app.id === appId ? { ...app, status, approvedOn: new Date().toISOString() } : app
      );
      return { leaveApplications };
    });
    get().persistData();
  },
  
  persistData: () => {
    try {
      const { employees, leaveApplications, salaryRecords } = get();
      const data = { employees, version: 2 };
      
      // Auto backup every 10 saves
      const saveCount = parseInt(localStorage.getItem('saveCount') || '0');
      if (saveCount % 10 === 0) {
        createBackup(data);
      }
      localStorage.setItem('saveCount', (saveCount + 1).toString());
      
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE_DATA, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEYS.LEAVE_APPLICATIONS, JSON.stringify(leaveApplications));
      localStorage.setItem(STORAGE_KEYS.SALARY_RECORDS, JSON.stringify(salaryRecords));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Please export and clear old data.');
      } else {
        console.error('Failed to persist data:', error);
      }
    }
  }
}));
