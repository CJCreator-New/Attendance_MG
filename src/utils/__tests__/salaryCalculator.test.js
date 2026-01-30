import { describe, it, expect } from 'vitest';
import { SALARY_CONSTANTS } from '../../constants';

const calculateSalary = (employee, payableDays) => {
  const earnedGross = (employee.gross * payableDays) / SALARY_CONSTANTS.DAYS_IN_MONTH;
  const basic = earnedGross * SALARY_CONSTANTS.BASIC_PERCENTAGE;
  const da = earnedGross * SALARY_CONSTANTS.DA_PERCENTAGE;
  const hra = earnedGross * SALARY_CONSTANTS.HRA_PERCENTAGE;
  const totalEarnings = basic + da + hra;
  
  const epfBase = Math.min(basic + da, SALARY_CONSTANTS.EPF_MAX_BASE);
  const epf = employee.gross > SALARY_CONSTANTS.EPF_THRESHOLD ? epfBase * SALARY_CONSTANTS.EPF_RATE : 0;
  const esi = employee.gross <= SALARY_CONSTANTS.ESI_THRESHOLD ? earnedGross * SALARY_CONSTANTS.ESI_RATE : 0;
  const profTax = earnedGross > SALARY_CONSTANTS.PROF_TAX_THRESHOLD ? SALARY_CONSTANTS.PROF_TAX_AMOUNT : 0;
  const totalDeduction = epf + esi + profTax;
  const netSalary = totalEarnings - totalDeduction;
  
  return { earnedGross, basic, da, hra, totalEarnings, epf, esi, profTax, totalDeduction, netSalary };
};

describe('Salary Calculator', () => {
  it('calculates basic salary as 50% of earned gross', () => {
    const result = calculateSalary({ gross: 30000 }, 31);
    expect(result.basic).toBe(15000);
  });

  it('applies EPF only when gross > 21000', () => {
    const result1 = calculateSalary({ gross: 25000 }, 31);
    expect(result1.epf).toBeGreaterThan(0);
    
    const result2 = calculateSalary({ gross: 20000 }, 31);
    expect(result2.epf).toBe(0);
  });

  it('applies ESI only when gross <= 21000', () => {
    const result1 = calculateSalary({ gross: 20000 }, 31);
    expect(result1.esi).toBeGreaterThan(0);
    
    const result2 = calculateSalary({ gross: 25000 }, 31);
    expect(result2.esi).toBe(0);
  });

  it('calculates net salary correctly', () => {
    const result = calculateSalary({ gross: 30000 }, 31);
    const expected = result.totalEarnings - result.totalDeduction;
    expect(result.netSalary).toBe(expected);
  });
});
