import React, { useState } from 'react';
import { Edit2, Trash2, X } from 'lucide-react';
import { LeaveBalance } from './LeaveBalance';
import { ATTENDANCE_CODE_LABELS } from '../constants';

export const MobileAttendanceView = ({ 
  employees, 
  formatCurrency, 
  getCellColor,
  onEdit,
  onDelete,
  onUpdateAttendance,
  dates,
  days
}) => {
  const [editingCell, setEditingCell] = useState(null);

  const handleCellClick = (empId, dateIdx) => {
    setEditingCell({ empId, dateIdx });
  };

  const handleStatusChange = (empId, dateIdx, status) => {
    onUpdateAttendance(empId, dateIdx, status);
    setEditingCell(null);
  };

  return (
    <>
      <div className="md:hidden space-y-4 p-4">
        {employees.map(emp => (
          <div key={emp.empId} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{emp.name}</h3>
                <p className="text-sm text-gray-600">ID: {emp.empId}</p>
                <LeaveBalance employee={emp} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(emp)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded min-h-[44px] min-w-[44px]"
                  aria-label={`Edit ${emp.name}`}
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(emp.empId)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded min-h-[44px] min-w-[44px]"
                  aria-label={`Delete ${emp.name}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Gross:</span>
                <span className="font-semibold ml-1">{formatCurrency(emp.gross)}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Net:</span>
                <span className="font-semibold ml-1">{formatCurrency(emp.netSalary)}</span>
              </div>
              <div className="bg-emerald-50 p-2 rounded">
                <span className="text-gray-600">Present:</span>
                <span className="font-semibold ml-1">{emp.presentDays}</span>
              </div>
              <div className="bg-rose-50 p-2 rounded">
                <span className="text-gray-600">Absent:</span>
                <span className="font-semibold ml-1">{emp.lossOfPay}</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs text-gray-600 mb-2">Attendance (Tap to edit)</p>
              <div className="grid grid-cols-7 gap-1">
                {emp.attendance.map((status, idx) => (
                  <button
                    key={idx}
                    className={`p-2 text-xs font-semibold rounded min-h-[44px] ${getCellColor(status)}`}
                    onClick={() => handleCellClick(emp.empId, idx)}
                    aria-label={`Day ${idx + 1}: ${status || 'empty'}`}
                  >
                    <div>{idx + 1}</div>
                    <div className="text-[10px]">{status || '-'}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white rounded-t-2xl md:rounded-lg w-full md:max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Day {editingCell.dateIdx + 1} - {days[editingCell.dateIdx]}
              </h3>
              <button
                onClick={() => setEditingCell(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ATTENDANCE_CODE_LABELS).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => handleStatusChange(editingCell.empId, editingCell.dateIdx, code)}
                  className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors min-h-[60px]"
                >
                  <div className="font-semibold text-lg">{code}</div>
                  <div className="text-xs text-gray-600">{label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
