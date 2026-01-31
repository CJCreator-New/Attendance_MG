import { Edit2, Trash2, Eye } from 'lucide-react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const sanitizeName = (name) => {
  return DOMPurify.sanitize(name, { ALLOWED_TAGS: [] });
};

const AttendanceOnlyRowComponent = ({
  employee,
  formatNumber,
  getCellColor,
  editMode,
  onEdit,
  onDelete,
  onToggleEdit,
  onUpdateAttendance,
  onViewEmployee,
  showSummaryColumns = true,
  isDragging = false,
  onDragStart,
  onDragEnter,
  onDragEnd
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">{employee.sno}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-mono">{employee.empId}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium">{sanitizeName(employee.name)}</td>
      
      {/* Attendance Summary */}
      {showSummaryColumns && (
        <>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.presentDays)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.paidHoliday)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.weekOff)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.onDuty)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.casualLeave)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center">{formatNumber(employee.lossOfPay)}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm text-center font-semibold">{formatNumber(employee.payableDays)}</td>
        </>
      )}

      {/* Daily Attendance */}
      {employee.attendance.map((status, idx) => {
        const key = `${employee.empId}-${idx}`;
        const isEditing = editMode[key];
        
        return (
          <td
            key={idx}
            className={`border border-gray-300 dark:border-gray-600 px-1 py-1 text-xs text-center w-12 ${getCellColor(status)} ${isDragging ? 'select-none' : ''}`}
            style={{ userSelect: isDragging ? 'none' : 'auto' }}
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
                className="w-full h-full bg-white border border-blue-500 focus:ring-2 focus:ring-blue-300 text-xs px-1 py-1 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">-</option>
                <option value="P">P</option>
                <option value="A">A</option>
                <option value="CL">CL</option>
                <option value="HCL">HCL</option>
                <option value="HP">HP</option>
                <option value="HL">HL</option>
                <option value="WO">WO</option>
                <option value="WW">WW</option>
                <option value="PH">PH</option>
                <option value="pH">pH</option>
                <option value="PHW">PHW</option>
                <option value="OD">OD</option>
                <option value="WFH">WFH</option>
              </select>
            ) : (
              <div 
                className="cursor-pointer hover:bg-blue-100 w-full h-full py-1 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDragging && onToggleEdit) {
                    onToggleEdit(employee.empId, idx);
                  }
                }}
                onMouseDown={(e) => {
                  if (e.button === 0 && onDragStart) {
                    onDragStart(employee.empId, idx, status);
                  }
                }}
                onMouseEnter={() => {
                  if (isDragging && onDragEnter) {
                    onDragEnter(employee.empId, idx);
                  }
                }}
                style={{ minHeight: '24px', userSelect: 'none' }}
              >
                {status || '-'}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
};

AttendanceOnlyRowComponent.propTypes = {
  employee: PropTypes.object.isRequired,
  formatNumber: PropTypes.func.isRequired,
  getCellColor: PropTypes.func.isRequired,
  editMode: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onToggleEdit: PropTypes.func.isRequired,
  onUpdateAttendance: PropTypes.func.isRequired,
  onViewEmployee: PropTypes.func,
  showSummaryColumns: PropTypes.bool,
  isDragging: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragEnd: PropTypes.func
};

export const AttendanceOnlyRow = memo(AttendanceOnlyRowComponent, (prev, next) => {
  return (
    prev.employee.empId === next.employee.empId &&
    prev.employee.attendance === next.employee.attendance &&
    prev.showSummaryColumns === next.showSummaryColumns &&
    prev.isDragging === next.isDragging &&
    JSON.stringify(prev.editMode) === JSON.stringify(next.editMode)
  );
});
