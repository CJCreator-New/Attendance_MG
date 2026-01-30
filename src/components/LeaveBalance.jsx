import React from 'react';
import { Calendar } from 'lucide-react';

export const LeaveBalance = ({ employee, onUpdate }) => {
  const openingCL = employee.openingCL || 0;
  const takenCL = employee.casualLeave || 0;
  const balanceCL = openingCL - takenCL;

  return (
    <div className="flex items-center gap-2 text-xs">
      <Calendar className="w-3 h-3 text-gray-400" />
      <span className={balanceCL < 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
        CL: {balanceCL.toFixed(1)}
      </span>
    </div>
  );
};
