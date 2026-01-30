import { ATTENDANCE_CODES } from '../constants';
import { isFutureDate } from './dateUtils';

export const validateAttendanceUpdate = (empId, dateIndex, status, dates) => {
  const errors = [];

  if (!empId) {
    errors.push('Employee ID is required');
  }

  if (dateIndex < 0 || dateIndex >= dates.length) {
    errors.push('Invalid date index');
  }

  if (status && !Object.values(ATTENDANCE_CODES).includes(status)) {
    errors.push(`Invalid attendance code: ${status}`);
  }

  if (dates[dateIndex] && isFutureDate(dates[dateIndex])) {
    errors.push('Cannot mark attendance for future dates');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmployeeData = (empData) => {
  const errors = [];

  if (!empData.empId || empData.empId.toString().trim() === '') {
    errors.push('Employee ID is required');
  }

  if (!empData.name || empData.name.trim() === '') {
    errors.push('Employee name is required');
  }

  if (!empData.gross || isNaN(empData.gross) || empData.gross <= 0) {
    errors.push('Valid gross salary is required');
  }

  if (empData.gross && empData.gross > 10000000) {
    errors.push('Gross salary seems unreasonably high');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateBulkUpdate = (dateIndices, status, employeeCount) => {
  const errors = [];

  if (!dateIndices || dateIndices.length === 0) {
    errors.push('No dates selected for bulk update');
  }

  if (!status || !Object.values(ATTENDANCE_CODES).includes(status)) {
    errors.push('Invalid attendance code selected');
  }

  if (employeeCount === 0) {
    errors.push('No employees to update');
  }

  return {
    isValid: errors.length === 0,
    errors,
    affectedCount: dateIndices.length * employeeCount
  };
};

import DOMPurify from 'dompurify';
import { VALIDATION_PATTERNS } from '../constants/uiConstants';

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] }).slice(0, 500);
};

export const validateEmployeeId = (empId) => {
  if (!empId || !empId.trim()) {
    return { isValid: false, error: 'Employee ID is required' };
  }
  if (!VALIDATION_PATTERNS.EMPLOYEE_ID.test(empId)) {
    return {
      isValid: false,
      error: 'Employee ID can only contain letters, numbers, hyphens, and underscores',
    };
  }
  return { isValid: true };
};
