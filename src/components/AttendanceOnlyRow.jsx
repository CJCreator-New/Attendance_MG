import { Edit2, Trash2, Eye } from 'lucide-react';
import PropTypes from 'prop-types';
import { ATTENDANCE_CODES } from '../constants';
import DOMPurify from 'dompurify';

const sanitizeName = (name) => {
  return DOMPurify.sanitize(name, { ALLOWED_TAGS: [] });
};

export const AttendanceOnlyRow = ({
  employee,
  formatNumber,
  getCellColor,
  editMode,
  onEdit,
  onDelete,
  onToggleEdit,
  onUpdateAttendance,
  onViewEmployee
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">{employee.sno}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-mono">{employee.empId}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium">{sanitizeName(employee.name)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right">₹{employee.gross?.toLocaleString('en-IN')}</td>
      
      {/* Attendance Summary */}
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.presentDays)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.paidHoliday)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.weekOff)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.onDuty)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.casualLeave)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.lossOfPay)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center font-semibold">{formatNumber(employee.payableDays)}</td>

      {/* Daily Attendance */}
      {employee.attendance.map((status, idx) => {
        const key = `${employee.empId}-${idx}`;
        const isEditing = editMode[key];
        
        return (
          <td
            key={idx}
            className={`border border-gray-300 dark:border-gray-600 px-2 py-2 text-xs text-center cursor-pointer ${getCellColor(status)}`}
            onClick={() => onToggleEdit(employee.empId, idx)}
          >
            {isEditing ? (
              <select
                value={status}
                onChange={(e) => {
                  onUpdateAttendance(employee.empId, idx, e.target.value);
                  onToggleEdit(employee.empId, idx);
                }}
                onBlur={() => onToggleEdit(employee.empId, idx)}
                autoFocus
                className="w-full bg-transparent border-0 focus:ring-0 text-xs"
              >
                <option value="">-</option>
                <option value={ATTENDANCE_CODES.PRESENT}>P</option>
                <option value={ATTENDANCE_CODES.ABSENT}>A</option>
                <option value={ATTENDANCE_CODES.CASUAL_LEAVE}>CL</option>
                <option value={ATTENDANCE_CODES.HALF_CL}>HCL</option>
                <option value={ATTENDANCE_CODES.HALF_PRESENT}>HP</option>
                <option value={ATTENDANCE_CODES.HALF_LEAVE}>HL</option>
                <option value={ATTENDANCE_CODES.WEEK_OFF}>WO</option>
                <option value={ATTENDANCE_CODES.WEEK_WEEK}>WW</option>
                <option value={ATTENDANCE_CODES.PUBLIC_HOLIDAY}>PH</option>
                <option value={ATTENDANCE_CODES.PAID_HOLIDAY}>pH</option>
                <option value={ATTENDANCE_CODES.PAID_HOLIDAY_WEEK}>PHW</option>
                <option value={ATTENDANCE_CODES.ON_DUTY}>OD</option>
                <option value={ATTENDANCE_CODES.WORK_FROM_HOME}>WFH</option>
              </select>
            ) : (
              status || '-'
            )}
          </td>
        );
      })}
    </tr>
  );
};

AttendanceOnlyRow.propTypes = {
  employee: PropTypes.object.isRequired,
  formatNumber: PropTypes.func.isRequired,
  getCellColor: PropTypes.func.isRequired,
  editMode: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onToggleEdit: PropTypes.func.isRequired,
  onUpdateAttendance: PropTypes.func.isRequired,
  onViewEmployee: PropTypes.func
};
