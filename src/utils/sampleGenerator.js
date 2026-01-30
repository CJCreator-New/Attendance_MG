export const generateSampleCSV = () => {
  const headers = ['Month', 'Employee ID', 'Name', 'Gross Salary', 'Opening CL'];
  const dates = Array.from({ length: 31 }, (_, i) => `Day${i + 1}`);
  const headerRow = [...headers, ...dates].join(',');

  const sampleRows = [
    ['January 2026', 'EMP001', 'John Doe', '25000', '8', ...Array(31).fill('P')],
    ['January 2026', 'EMP002', 'Jane Smith', '30000', '8', ...Array(31).fill('P')],
    ['January 2026', 'EMP003', 'Bob Johnson', '22000', '8', ...Array(31).fill('P')]
  ];

  const csvContent = [
    headerRow,
    ...sampleRows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

export const generateSampleExcel = async () => {
  const XLSX = await import('xlsx');
  
  const headers = ['Month', 'Employee ID', 'Name', 'Gross Salary', 'Opening CL'];
  const dates = Array.from({ length: 31 }, (_, i) => `Day${i + 1}`);
  
  const data = [
    [...headers, ...dates],
    ['January 2026', 'EMP001', 'John Doe', 25000, 8, ...Array(31).fill('P')],
    ['January 2026', 'EMP002', 'Jane Smith', 30000, 8, ...Array(31).fill('P')],
    ['January 2026', 'EMP003', 'Bob Johnson', 22000, 8, ...Array(31).fill('P')]
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
  
  XLSX.writeFile(wb, 'attendance_sample.xlsx');
};

export const downloadSampleCSV = () => {
  const csv = generateSampleCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'attendance_sample.csv';
  link.click();
  URL.revokeObjectURL(url);
};
