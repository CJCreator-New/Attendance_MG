import { SALARY_CONSTANTS, ATTENDANCE_CODES } from '../constants';

export const calculateAttendanceSummary = (attendance) => {
  let presentDays = 0, casualLeave = 0, weekOff = 0, paidHoliday = 0, onDuty = 0, absent = 0;
  
  attendance.forEach(status => {
    switch(status) {
      case ATTENDANCE_CODES.PRESENT:
        presentDays++;
        break;
      case ATTENDANCE_CODES.CASUAL_LEAVE:
        casualLeave++;
        break;
      case ATTENDANCE_CODES.HALF_CL:
        casualLeave += 0.5;
        presentDays += 0.5;
        break;
      case ATTENDANCE_CODES.HALF_PRESENT:
        presentDays += 0.5;
        break;
      case ATTENDANCE_CODES.HALF_LEAVE:
        casualLeave += 0.5;
        break;
      case ATTENDANCE_CODES.WEEK_OFF:
      case ATTENDANCE_CODES.WEEK_WEEK:
        weekOff++;
        break;
      case ATTENDANCE_CODES.PUBLIC_HOLIDAY:
      case ATTENDANCE_CODES.PAID_HOLIDAY:
      case ATTENDANCE_CODES.PAID_HOLIDAY_WEEK:
        paidHoliday++;
        break;
      case ATTENDANCE_CODES.ON_DUTY:
      case ATTENDANCE_CODES.WORK_FROM_HOME:
        onDuty++;
        break;
      case ATTENDANCE_CODES.ABSENT:
        absent++;
        break;
    }
  });
  
  return {
    presentDays,
    casualLeave,
    weekOff,
    paidHoliday,
    onDuty,
    lossOfPay: absent,
    payableDays: presentDays + casualLeave + weekOff + paidHoliday + onDuty
  };
};

export const calculateSalary = (employee, attendance) => {
  const summary = calculateAttendanceSummary(attendance);
  const earnedGross = (employee.gross * summary.payableDays) / SALARY_CONSTANTS.DAYS_IN_MONTH;
  
  const basic = earnedGross * SALARY_CONSTANTS.BASIC_PERCENTAGE;
  const da = earnedGross * SALARY_CONSTANTS.DA_PERCENTAGE;
  const hra = earnedGross * SALARY_CONSTANTS.HRA_PERCENTAGE;
  const bonus = employee.bonus || 0;
  const otherAllowance = employee.otherAllowance || 0;
  const ot = employee.ot || 0;
  const totalEarnings = basic + da + hra + bonus + otherAllowance + ot;
  
  const epfBase = Math.min(basic + da, SALARY_CONSTANTS.EPF_MAX_BASE);
  const epf = employee.gross > SALARY_CONSTANTS.EPF_THRESHOLD ? epfBase * SALARY_CONSTANTS.EPF_RATE : 0;
  const esi = employee.gross <= SALARY_CONSTANTS.ESI_THRESHOLD ? earnedGross * SALARY_CONSTANTS.ESI_RATE : 0;
  const profTax = earnedGross > SALARY_CONSTANTS.PROF_TAX_THRESHOLD ? SALARY_CONSTANTS.PROF_TAX_AMOUNT : 0;
  const otherDeduction = employee.otherDeduction || 0;
  const totalDeduction = epf + esi + profTax + otherDeduction;
  
  const netSalary = totalEarnings - totalDeduction;
  
  return {
    ...summary,
    earnedGross,
    basic,
    da,
    hra,
    bonus,
    otherAllowance,
    ot,
    totalEarnings,
    epf,
    esi,
    profTax,
    otherDeduction,
    totalDeduction,
    netSalary
  };
};
