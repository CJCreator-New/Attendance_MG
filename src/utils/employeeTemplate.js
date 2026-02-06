import * as XLSX from 'xlsx';

export const downloadEmployeeTemplate = (showToast) => {
  try {
    const template = [
      {
        'Employee ID': 'EMP001',
        'Name': 'John Doe',
        'Department': 'Engineering',
        'Designation': 'Software Engineer',
        'Gross Salary': 50000,
        'Email': 'john@company.com',
        'Phone': '+91 9876543210',
        'Opening CL': 8
      },
      {
        'Employee ID': 'EMP002',
        'Name': 'Jane Smith',
        'Department': 'HR',
        'Designation': 'HR Manager',
        'Gross Salary': 45000,
        'Email': 'jane@company.com',
        'Phone': '+91 9876543211',
        'Opening CL': 8
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Template');
    XLSX.writeFile(wb, 'Employee_Import_Template.xlsx');
    
    if (showToast) {
      showToast('Template downloaded successfully', 'success');
    }
  } catch (error) {
    console.error('Failed to download template:', error);
    if (showToast) {
      showToast('Failed to download template: ' + error.message, 'error');
    }
  }
};
