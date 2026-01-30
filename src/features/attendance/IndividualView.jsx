import React from 'react';
import { ATTENDANCE_CODE_COLORS, ATTENDANCE_CODE_LABELS } from '../../constants';

export const IndividualView = ({ employee, onUpdateAttendance, onBack }) => {
  const getStatusColor = (status) => {
    return ATTENDANCE_CODE_COLORS[status] || 'bg-gray-50 hover:bg-gray-100';
  };

  const clBalance = employee.openingCL - employee.casualLeave;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button 
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
      >
        ← Back to All Employees
      </button>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{employee.name}</h2>
            <p className="text-gray-600 mt-1">ID: {employee.empId}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">₹{employee.gross.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Gross Salary</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Present Days</div>
            <div className="text-2xl font-bold text-emerald-600">{employee.presentDays}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">CL Balance</div>
            <div className={`text-2xl font-bold ${clBalance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
              {clBalance}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Payable Days</div>
            <div className="text-2xl font-bold text-purple-600">{employee.payableDays}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Net Salary</div>
            <div className="text-2xl font-bold text-green-600">₹{employee.netSalary.toLocaleString()}</div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">Monthly Attendance</h3>
        <div className="grid grid-cols-7 gap-3">
          {employee.attendance.map((status, idx) => (
            <button
              key={idx}
              onClick={() => onUpdateAttendance(employee.empId, idx)}
              className={`p-4 rounded-lg text-center transition-all hover:scale-105 ${getStatusColor(status)}`}
            >
              <div className="text-xs text-gray-600 mb-1">Day {idx + 1}</div>
              <div className="text-xl font-bold">{status || '-'}</div>
              {status && (
                <div className="text-xs mt-1">{ATTENDANCE_CODE_LABELS[status]}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
