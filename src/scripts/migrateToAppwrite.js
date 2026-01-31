import { EmployeeService } from '../services/employeeService';
import { AttendanceService } from '../services/attendanceService';
import { MonthService } from '../services/monthService';
import { SalaryConfigService } from '../services/salaryConfigService';
import { loadFromLocalStorage } from '../utils/storage';

export async function migrateToAppwrite() {
  console.log('🚀 Starting migration from localStorage to Appwrite...');
  
  try {
    const localData = loadFromLocalStorage();
    
    if (!localData || !localData.employees) {
      console.log('❌ No data found in localStorage');
      return { success: false, message: 'No data to migrate' };
    }

    console.log(`📊 Found ${localData.employees.length} employees to migrate`);

    // Step 1: Create Month
    console.log('📅 Creating month data...');
    const monthDoc = await MonthService.createMonth({
      month: localData.month,
      year: new Date(localData.dates[0]).getFullYear(),
      dates: localData.dates,
      days: localData.days,
      isActive: true
    });
    console.log(`✅ Month created: ${monthDoc.$id}`);

    // Step 2: Migrate Employees
    console.log('👥 Migrating employees...');
    const employeeMap = new Map();
    
    for (const emp of localData.employees) {
      try {
        const employeeDoc = await EmployeeService.createEmployee({
          empId: emp.empId,
          name: emp.name,
          gross: emp.gross,
          openingCL: emp.openingCL || 8,
          department: emp.department || '',
          status: 'active',
          sno: emp.sno
        });
        employeeMap.set(emp.empId, employeeDoc.$id);
        console.log(`✅ Employee migrated: ${emp.name} (${emp.empId})`);

        // Step 3: Create Attendance for each employee
        if (emp.attendance && emp.attendance.length > 0) {
          await AttendanceService.createAttendance({
            employeeId: emp.empId,
            monthId: monthDoc.$id,
            attendance: emp.attendance,
            presentDays: emp.presentDays || 0,
            paidHoliday: emp.paidHoliday || 0,
            weekOff: emp.weekOff || 0,
            onDuty: emp.onDuty || 0,
            casualLeave: emp.casualLeave || 0,
            lossOfPay: emp.lossOfPay || 0,
            payableDays: emp.payableDays || 0
          });
          console.log(`  ✅ Attendance created for ${emp.name}`);
        }

        // Step 4: Create Salary Config
        await SalaryConfigService.createSalaryConfig({
          employeeId: emp.empId,
          bonus: emp.bonus || 0,
          otherAllowance: emp.otherAllowance || 0,
          ot: emp.ot || 0,
          otherDeduction: emp.otherDeduction || 0
        });
        console.log(`  ✅ Salary config created for ${emp.name}`);

      } catch (error) {
        console.error(`❌ Error migrating employee ${emp.empId}:`, error.message);
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Summary: ${employeeMap.size}/${localData.employees.length} employees migrated`);
    
    return {
      success: true,
      message: `Successfully migrated ${employeeMap.size} employees`,
      monthId: monthDoc.$id,
      employeeCount: employeeMap.size
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToAppwrite()
    .then(result => {
      console.log('\n' + (result.success ? '✅' : '❌'), result.message);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}
