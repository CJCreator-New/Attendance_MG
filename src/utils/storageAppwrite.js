import { EmployeeService } from '../services/employeeService';
import { AttendanceService } from '../services/attendanceService';
import { MonthService } from '../services/monthService';
import { SalaryConfigService } from '../services/salaryConfigService';
import { calculateSalary } from './salaryCalculator';

export const saveToAppwrite = async (data) => {
  try {
    const activeMonth = await MonthService.getActiveMonth();
    
    if (!activeMonth) {
      throw new Error('No active month found');
    }

    for (const emp of data.employees) {
      const existingEmp = await EmployeeService.getEmployeeByEmpId(emp.empId);
      
      if (existingEmp) {
        await EmployeeService.updateEmployee(existingEmp.$id, {
          name: emp.name,
          gross: emp.gross,
          openingCL: emp.openingCL,
          department: emp.department,
          sno: emp.sno
        });
      } else {
        await EmployeeService.createEmployee(emp);
      }

      const existingAttendance = await AttendanceService.getAttendanceByEmployeeAndMonth(
        emp.empId,
        activeMonth.$id
      );

      const attendanceData = {
        employeeId: emp.empId,
        monthId: activeMonth.$id,
        attendance: emp.attendance,
        presentDays: emp.presentDays,
        paidHoliday: emp.paidHoliday,
        weekOff: emp.weekOff,
        onDuty: emp.onDuty,
        casualLeave: emp.casualLeave,
        lossOfPay: emp.lossOfPay,
        payableDays: emp.payableDays
      };

      if (existingAttendance) {
        await AttendanceService.updateAttendance(existingAttendance.$id, attendanceData);
      } else {
        await AttendanceService.createAttendance(attendanceData);
      }

      const existingSalaryConfig = await SalaryConfigService.getSalaryConfigByEmployeeId(emp.empId);
      const salaryConfigData = {
        employeeId: emp.empId,
        bonus: emp.bonus || 0,
        otherAllowance: emp.otherAllowance || 0,
        ot: emp.ot || 0,
        otherDeduction: emp.otherDeduction || 0
      };

      if (existingSalaryConfig) {
        await SalaryConfigService.updateSalaryConfig(existingSalaryConfig.$id, salaryConfigData);
      } else {
        await SalaryConfigService.createSalaryConfig(salaryConfigData);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to save to Appwrite:', error);
    return { success: false, error: error.message };
  }
};

export const loadFromAppwrite = async () => {
  try {
    const activeMonth = await MonthService.getActiveMonth();
    
    if (!activeMonth) {
      return null;
    }

    const employees = await EmployeeService.getAllEmployees();
    const attendanceRecords = await AttendanceService.getAllAttendanceForMonth(activeMonth.$id);

    const employeesWithAttendance = await Promise.all(
      employees.map(async (emp) => {
        const attendance = attendanceRecords.find(a => a.employeeId === emp.empId);
        const salaryConfig = await SalaryConfigService.getSalaryConfigByEmployeeId(emp.empId);

        const attendanceArray = attendance ? attendance.attendance : new Array(activeMonth.dates.length).fill('');
        const calculated = calculateSalary(emp, attendanceArray);

        return {
          sno: emp.sno,
          empId: emp.empId,
          name: emp.name,
          gross: emp.gross,
          openingCL: emp.openingCL,
          department: emp.department,
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
      })
    );

    return {
      month: activeMonth.month,
      employees: employeesWithAttendance,
      dates: activeMonth.dates,
      days: activeMonth.days
    };
  } catch (error) {
    console.error('Failed to load from Appwrite:', error);
    return null;
  }
};

// Keep localStorage functions for backward compatibility
export { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage, getStorageInfo } from './storageLocal';
