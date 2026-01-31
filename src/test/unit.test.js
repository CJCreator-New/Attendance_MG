import { describe, it, expect } from 'vitest';
import { calculateSalary } from '../utils/salaryCalculator';
import { validateAttendanceUpdate } from '../utils/validation';
import { getDaysInMonth, isLeapYear } from '../utils/dateUtils';

describe('Salary Calculator', () => {
  it('calculates basic salary correctly', () => {
    const employee = { gross: 30000 };
    const attendance = Array(31).fill('P');
    const result = calculateSalary(employee, attendance);
    expect(result.basic).toBe(15000);
  });

  it('calculates payable days correctly', () => {
    const employee = { gross: 30000 };
    const attendance = ['P', 'P', 'A', 'CL', 'WO'];
    const result = calculateSalary(employee, attendance);
    expect(result.payableDays).toBeGreaterThan(0);
  });
});

describe('Validation', () => {
  it('validates attendance update', () => {
    const result = validateAttendanceUpdate('EMP001', 0, 'P', ['2024-01-01']);
    expect(result.isValid).toBe(true);
  });

  it('rejects invalid attendance code', () => {
    const result = validateAttendanceUpdate('EMP001', 0, 'INVALID', ['2024-01-01']);
    expect(result.isValid).toBe(false);
  });
});

describe('Date Utils', () => {
  it('calculates days in month correctly', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29); // Feb 2024 (leap year)
    expect(getDaysInMonth(2023, 1)).toBe(28); // Feb 2023
  });

  it('detects leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
  });
});
