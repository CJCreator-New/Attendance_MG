import PropTypes from 'prop-types';

// Common PropTypes definitions

export const EmployeePropType = PropTypes.shape({
  empId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  gross: PropTypes.number.isRequired,
  attendance: PropTypes.arrayOf(PropTypes.string),
  openingCL: PropTypes.number,
  presentDays: PropTypes.number,
  casualLeave: PropTypes.number,
  netSalary: PropTypes.number,
});

export const DatePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.instanceOf(Date),
]);

export const AttendanceCodePropType = PropTypes.oneOf([
  'P', 'A', 'CL', 'HCL', 'HP', 'HL', 'WO', 'WW', 'PH', 'pH', 'PHW', 'OD', 'WFH', ''
]);

export const ToastPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
});

export const SalaryRecordPropType = PropTypes.shape({
  empId: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  basic: PropTypes.number,
  da: PropTypes.number,
  hra: PropTypes.number,
  totalEarnings: PropTypes.number,
  epf: PropTypes.number,
  esi: PropTypes.number,
  totalDeduction: PropTypes.number,
  netSalary: PropTypes.number,
});

export const LeaveApplicationPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  empId: PropTypes.string.isRequired,
  leaveType: PropTypes.string.isRequired,
  startDate: DatePropType.isRequired,
  endDate: DatePropType.isRequired,
  reason: PropTypes.string,
  status: PropTypes.oneOf(['pending', 'approved', 'rejected']).isRequired,
});
