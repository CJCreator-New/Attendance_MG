import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Building2 } from 'lucide-react';

export const DepartmentChart = ({ employees }) => {
  const deptData = {};
  
  employees.forEach(emp => {
    const dept = emp.department || 'Unassigned';
    if (!deptData[dept]) {
      deptData[dept] = { name: dept, employees: 0, avgAttendance: 0, totalPresent: 0 };
    }
    deptData[dept].employees++;
    deptData[dept].totalPresent += emp.presentDays || 0;
  });

  const data = Object.values(deptData).map(d => ({
    ...d,
    avgAttendance: (d.totalPresent / d.employees).toFixed(1)
  }));

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold">Department Overview</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          <Legend />
          <Bar dataKey="employees" fill="#3b82f6" name="Employees" />
          <Bar dataKey="avgAttendance" fill="#22c55e" name="Avg Attendance" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
