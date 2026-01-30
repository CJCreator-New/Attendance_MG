import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { LeaveBalance } from './LeaveBalance';
import DOMPurify from 'dompurify';

const sanitizeName = (name) => {
  return DOMPurify.sanitize(name, { ALLOWED_TAGS: [] });
};

export const EmployeeRow = React.memo(({ 
  employee, 
  formatCurrency, 
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
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-300 px-3 py-2 text-sm text-center">{employee.sno}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm font-mono">
        <div className="flex items-center gap-2">
          {employee.empId}
          <button
            onClick={() => onViewEmployee && onViewEmployee(employee)}
            className="text-purple-600 hover:text-purple-800 no-print"
            aria-label={`View ${employee.name} details`}
            title="View employee details"
          >
            <Eye className="w-3 h-3" aria-hidden="true" />
          </button>
          <button
            onClick={() => onEdit(employee)}
            className="text-blue-600 hover:text-blue-800 no-print"
            aria-label={`Edit ${employee.name}`}
          >
            <Edit2 className="w-3 h-3" aria-hidden="true" />
          </button>
          <button
            onClick={() => onDelete(employee.empId)}
            className="text-red-600 hover:text-red-800 no-print"
            aria-label={`Delete ${employee.name}`}
          >
            <Trash2 className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </td>
      <td className="border border-gray-300 px-3 py-2 text-sm font-medium whitespace-nowrap">
        <div className="flex flex-col">
          <span>{sanitizeName(employee.name)}</span>
          <LeaveBalance employee={employee} />
        </div>
      </td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right font-semibold">{formatCurrency(employee.gross)}</td>
      
      <td className="border border-gray-300 px-3 py-2 text-sm text-center bg-emerald-50">{formatNumber(employee.presentDays)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-center bg-violet-50">{formatNumber(employee.paidHoliday)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-center bg-slate-50">{formatNumber(employee.weekOff)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-center bg-cyan-50">{formatNumber(employee.onDuty)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-center bg-amber-50">{formatNumber(employee.casualLeave)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-center bg-rose-50">{formatNumber(employee.lossOfPay)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-center bg-blue-50 font-semibold">{formatNumber(employee.payableDays)}</td>
      
      <td className="border border-gray-300 px-3 py-2 text-sm text-right font-semibold bg-yellow-50">{formatCurrency(employee.earnedGross)}</td>
      
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-green-50">{formatCurrency(employee.basic)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-green-50">{formatCurrency(employee.da)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-green-50">{formatCurrency(employee.hra)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-green-50">{formatCurrency(employee.bonus)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-green-50">{formatCurrency(employee.otherAllowance)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-green-50">{formatCurrency(employee.ot)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-green-100 font-semibold">{formatCurrency(employee.totalEarnings)}</td>
      
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-red-50">{formatCurrency(employee.epf)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-red-50">{formatCurrency(employee.esi)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-red-50">{formatCurrency(employee.profTax)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-red-50">{formatCurrency(employee.otherDeduction)}</td>
      <td className="border border-gray-300 px-3 py-2 text-sm text-right bg-red-100 font-semibold">{formatCurrency(employee.totalDeduction)}</td>
      
      <td className="border border-gray-300 px-3 py-2 text-sm text-right font-bold bg-blue-100">{formatCurrency(employee.netSalary)}</td>
      
      {employee.attendance.map((status, dateIdx) => {
        const cellKey = `${employee.empId}-${dateIdx}`;
        const isEditing = editMode[cellKey];
        
        return (
          <td
            key={dateIdx}
            className={`border border-gray-300 px-2 py-2 text-sm text-center font-semibold cursor-pointer transition-colors focus:ring-2 focus:ring-blue-500 ${getCellColor(status)}`}
            onClick={() => onToggleEdit(employee.empId, dateIdx)}
            tabIndex={0}
            role="gridcell"
            aria-label={`${employee.name} attendance for day ${dateIdx + 1}: ${status || 'empty'}`}
          >
            {isEditing ? (
              <select
                value={status}
                onChange={(e) => {
                  onUpdateAttendance(employee.empId, dateIdx, e.target.value);
                  onToggleEdit(employee.empId, dateIdx);
                }}
                onBlur={() => onToggleEdit(employee.empId, dateIdx)}
                autoFocus
                className="w-full text-center border-0 bg-transparent font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={`Change attendance for ${employee.name} day ${dateIdx + 1}`}
              >
                <option value=""></option>
                <option value="P">P - Present</option>
                <option value="A">A - Absent</option>
                <option value="CL">CL - Casual Leave</option>
                <option value="HCL">HCL - Half CL</option>
                <option value="HP">HP - Half Present</option>
                <option value="HL">HL - Half Leave</option>
                <option value="WO">WO - Week Off</option>
                <option value="WW">WW - Week Week</option>
                <option value="PH">PH - Public Holiday</option>
                <option value="pH">pH - Paid Holiday</option>
                <option value="PHW">PHW - PH Week</option>
                <option value="OD">OD - On Duty</option>
                <option value="WFH">WFH - Work From Home</option>
              </select>
            ) : (
              <span>{status || '-'}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}, (prev, next) => {
  return prev.employee.empId === next.employee.empId &&
         prev.employee.attendance === next.employee.attendance &&
         prev.editMode === next.editMode;
});

EmployeeRow.displayName = 'EmployeeRow';
