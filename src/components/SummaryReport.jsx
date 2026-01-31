import React, { useEffect } from 'react';
import { X, TrendingUp, Users } from 'lucide-react';

export const SummaryReport = ({ employees, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  const totalEmployees = employees.length;
  const avgAttendance = employees.reduce((sum, emp) => sum + emp.presentDays, 0) / totalEmployees;
  const totalAbsent = employees.reduce((sum, emp) => sum + emp.lossOfPay, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 id="summary-title" className="text-2xl font-bold">Attendance Summary Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close summary report">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Total Employees</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Avg Attendance</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{avgAttendance.toFixed(1)} days</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Total Present Days</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{employees.reduce((sum, emp) => sum + emp.presentDays, 0)}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">Total Payable Days</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{employees.reduce((sum, emp) => sum + emp.payableDays, 0)}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Attendance Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Absent Days:</span>
              <span className="font-semibold text-red-600">{totalAbsent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Casual Leave:</span>
              <span className="font-semibold">{employees.reduce((sum, emp) => sum + emp.casualLeave, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Week Offs:</span>
              <span className="font-semibold">{employees.reduce((sum, emp) => sum + emp.weekOff, 0)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};
