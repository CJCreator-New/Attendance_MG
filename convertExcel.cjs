const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('Attentance Sheet -Jan 2026.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

const month = jsonData[0][0]?.replace('SALARY FOR THE  MONTH OF ', '') || 'Unknown';

const dateRow = jsonData[1];
const dates = [];
for (let i = 28; i < 59; i++) {
  if (dateRow[i]) dates.push(dateRow[i]);
}

const dayRow = jsonData[2];
const days = [];
for (let i = 28; i < 59; i++) {
  if (dayRow[i]) days.push(dayRow[i]);
}

const employees = [];
for (let i = 3; i < jsonData.length; i++) {
  const row = jsonData[i];
  if (!row[0]) continue;

  const attendance = [];
  for (let j = 28; j < 59; j++) {
    attendance.push(row[j] || '');
  }

  employees.push({
    sno: row[0],
    empId: row[1],
    epfNo: row[2],
    esiNo: row[3],
    name: row[4],
    gross: row[5],
    presentDays: row[6],
    paidHoliday: row[7],
    weekOff: row[8],
    onDuty: row[9],
    casualLeave: row[10],
    lossOfPay: row[11],
    payableDays: row[12],
    earnedGross: row[13],
    basic: row[14],
    da: row[15],
    hra: row[16],
    bonus: row[17],
    otherAllowance: row[18],
    ot: row[19],
    totalEarnings: row[20],
    epf: row[21],
    esi: row[22],
    profTax: row[23],
    otherDeduction: row[24],
    totalDeduction: row[25],
    netSalary: row[26],
    attendance
  });
}

const result = { month, dates, days, employees };
fs.writeFileSync('src/data.json', JSON.stringify(result, null, 2));
console.log('Data converted successfully!');
