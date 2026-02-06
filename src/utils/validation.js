export const validateAttendanceUpdate = (value, date) => {
  const validCodes = ['P', 'A', 'CL', 'HCL', 'HP', 'HL', 'WO', 'WW', 'PH', 'pH', 'PHW', 'OD', 'WFH'];
  if (!validCodes.includes(value)) {
    return { isValid: false, error: 'Invalid attendance code' };
  }
  if (date && new Date(date) > new Date()) {
    return { isValid: false, error: 'Cannot mark attendance for future dates' };
  }
  return { isValid: true };
};

export const validateEmployeeId = (empId) => {
  if (!empId || !empId.trim()) {
    return { isValid: false, error: 'Employee ID is required' };
  }
  if (empId.length < 2 || empId.length > 20) {
    return { isValid: false, error: 'Employee ID must be 2-20 characters' };
  }
  return { isValid: true };
};

export const validators = {
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      throw new Error(`${fieldName} is required`);
    }
    return true;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
    return true;
  },

  phone: (value) => {
    const phoneRegex = /^[\d+\-() ]{10,}$/;
    if (!phoneRegex.test(value)) {
      throw new Error('Invalid phone format');
    }
    return true;
  },

  number: (value, min, max) => {
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error('Must be a number');
    if (min !== undefined && num < min) throw new Error(`Must be >= ${min}`);
    if (max !== undefined && num > max) throw new Error(`Must be <= ${max}`);
    return true;
  },

  length: (value, min, max) => {
    const len = String(value).length;
    if (min !== undefined && len < min) throw new Error(`Min length: ${min}`);
    if (max !== undefined && len > max) throw new Error(`Max length: ${max}`);
    return true;
  },

  date: (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    return true;
  }
};

export const validateEmployee = (data) => {
  validators.required(data.empId, 'Employee ID');
  validators.required(data.name, 'Name');
  validators.length(data.name, 2, 100);
  validators.number(data.gross, 0, 10000000);
  if (data.email) validators.email(data.email);
  if (data.phone) validators.phone(data.phone);
  return true;
};

export const validateAttendance = (data) => {
  validators.required(data.employeeId, 'Employee ID');
  validators.required(data.monthId, 'Month ID');
  validators.required(data.attendance, 'Attendance data');
  return true;
};
