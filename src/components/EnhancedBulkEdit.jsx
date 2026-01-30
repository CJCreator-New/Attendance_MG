import { useState } from 'react';
import { Calendar, Users, X } from 'lucide-react';
import { ATTENDANCE_CODE_LABELS } from '../constants';

export const EnhancedBulkEdit = ({ employees, dates, days, onBulkUpdate, onClose }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedWeek, setSelectedWeek] = useState('');
  const [attendanceCode, setAttendanceCode] = useState('P');

  const weeks = [
    { label: 'Week 1 (1-7)', days: [0,1,2,3,4,5,6] },
    { label: 'Week 2 (8-14)', days: [7,8,9,10,11,12,13] },
    { label: 'Week 3 (15-21)', days: [14,15,16,17,18,19,20] },
    { label: 'Week 4 (22-28)', days: [21,22,23,24,25,26,27] },
    { label: 'Week 5 (29-31)', days: [28,29,30] }
  ];

  const handleApply = () => {
    let dateIndices = [];
    
    if (selectedWeek) {
      const week = weeks.find(w => w.label === selectedWeek);
      dateIndices = week.days;
    } else if (dateRange.start && dateRange.end) {
      const start = parseInt(dateRange.start);
      const end = parseInt(dateRange.end);
      dateIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
    }
    
    onBulkUpdate(selectedEmployees, dateIndices, attendanceCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Bulk Edit Attendance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Employees</label>
            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === 0}
                  onChange={() => setSelectedEmployees([])}
                  className="rounded"
                />
                <span className="font-semibold">All Employees</span>
              </label>
              {employees.map(emp => (
                <label key={emp.empId} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.empId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees([...selectedEmployees, emp.empId]);
                      } else {
                        setSelectedEmployees(selectedEmployees.filter(id => id !== emp.empId));
                      }
                    }}
                    className="rounded"
                  />
                  <span>{emp.name} ({emp.empId})</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Week</label>
            <select
              value={selectedWeek}
              onChange={(e) => { setSelectedWeek(e.target.value); setDateRange({ start: '', end: '' }); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a week...</option>
              {weeks.map(week => (
                <option key={week.label} value={week.label}>{week.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dateRange.start}
                  onChange={(e) => { setDateRange({ ...dateRange, start: e.target.value }); setSelectedWeek(''); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dateRange.end}
                  onChange={(e) => { setDateRange({ ...dateRange, end: e.target.value }); setSelectedWeek(''); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="31"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Code</label>
            <select
              value={attendanceCode}
              onChange={(e) => setAttendanceCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {Object.entries(ATTENDANCE_CODE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>{code} - {label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
