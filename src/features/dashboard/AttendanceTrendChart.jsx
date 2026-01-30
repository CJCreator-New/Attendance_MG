import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../../components/ui/Card';
import { TrendingUp } from 'lucide-react';

export const AttendanceTrendChart = ({ employees }) => {
  const data = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const present = employees.filter(emp => emp.attendance[i] === 'P').length;
    const absent = employees.filter(emp => emp.attendance[i] === 'A').length;
    return { 
      day, 
      present, 
      absent,
      percentage: ((present / employees.length) * 100).toFixed(0) 
    };
  });

  const avgAttendance = (data.reduce((sum, d) => sum + parseInt(d.percentage), 0) / data.length).toFixed(1);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Attendance Trend</h3>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">{avgAttendance}%</span>
        </motion.div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          />
          <Legend />
          <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} name="Present" />
          <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} name="Absent" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
