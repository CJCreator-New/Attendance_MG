import * as XLSX from 'xlsx';

export const exportToExcel = (data) => {
  const rows = [];
  
  // Header row
  rows.push([`SALARY FOR THE  MONTH OF ${data.month}`]);
  
  // Column headers
  const headers = [
    'S. NO', 'Emp:ID', 'EPF No', 'ESI NO', 'Name', 'Gross',
    'Attendance', '', '', '', '', '', '',
    'Earned Gross',
    'EARNINGS', '', '', '', '', '', '',
    'DEDUCTION', '', '', '', '',
    'Net Salary', '',
    ...data.dates
  ];
  rows.push(headers);
  
  // Sub-headers
  const subHeaders = [
    '', '', 'EPF No', 'ESI NO', '', '',
    'Present Days', 'Paid Holiday', 'Week off', 'On Duty / WFH', 'Casual Leave', 'Loss of pay', 'No.of Payable Days',
    '',
    'Basic', 'DA', 'HRA', 'Bonus', 'Other Allowance', 'OT', 'Total Earnings',
    'EPF', 'ESI', 'Proffesional Tax', 'Other deduction', 'Total Deduction',
    '', '',
    ...data.days
  ];
  rows.push(subHeaders);
  
  // Employee data
  data.employees.forEach(emp => {
    rows.push([
      emp.sno,
      emp.empId,
      emp.epfNo || '',
      emp.esiNo || '',
      emp.name,
      emp.gross,
      emp.presentDays,
      emp.paidHoliday,
      emp.weekOff,
      emp.onDuty,
      emp.casualLeave,
      emp.lossOfPay,
      emp.payableDays,
      emp.earnedGross,
      emp.basic,
      emp.da,
      emp.hra,
      emp.bonus || '',
      emp.otherAllowance || '',
      emp.ot || '',
      emp.totalEarnings,
      emp.epf || '',
      emp.esi || '',
      emp.profTax || '',
      emp.otherDeduction || '',
      emp.totalDeduction,
      emp.netSalary,
      '',
      ...emp.attendance
    ]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
  
  XLSX.writeFile(wb, `Attendance_${data.month}.xlsx`);
};
