import React, { useState, useEffect } from 'react';
import { ReportBuilder } from '../reports/ReportBuilder';

export const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('attendanceData');
    if (data) {
      const parsed = JSON.parse(data);
      setEmployees(parsed.employees || []);
      setMonth(parsed.month || 'January');
      setYear(new Date().getFullYear());
    }
  }, []);

  return (
    <div>
      <ReportBuilder employees={employees} month={month} year={year} />
    </div>
  );
};
