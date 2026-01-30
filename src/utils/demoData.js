export const generateDemoData = () => {
  const demoEmployees = [
    { empId: 'EMP001', name: 'John Doe', gross: 35000, openingCL: 8, department: 'IT' },
    { empId: 'EMP002', name: 'Jane Smith', gross: 28000, openingCL: 10, department: 'HR' },
    { empId: 'EMP003', name: 'Mike Johnson', gross: 42000, openingCL: 6, department: 'Sales' },
    { empId: 'EMP004', name: 'Sarah Williams', gross: 31000, openingCL: 9, department: 'IT' },
    { empId: 'EMP005', name: 'David Brown', gross: 25000, openingCL: 12, department: 'Operations' },
  ];

  const attendance = Array(31).fill('P');
  [6, 13, 20, 27].forEach(i => attendance[i] = 'WO');
  attendance[10] = 'CL';
  attendance[15] = 'PH';

  return demoEmployees.map(emp => ({ ...emp, attendance: [...attendance] }));
};

export const isDemoMode = () => {
  return localStorage.getItem('demo_mode') === 'true';
};

export const enableDemoMode = () => {
  localStorage.setItem('demo_mode', 'true');
};

export const disableDemoMode = () => {
  localStorage.removeItem('demo_mode');
};
