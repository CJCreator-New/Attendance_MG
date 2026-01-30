import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import { AttendanceOnlyRow } from './AttendanceOnlyRow';

export const VirtualAttendanceTable = ({ 
  employees, 
  formatNumber, 
  getCellColor, 
  editMode, 
  onEdit, 
  onDelete, 
  onToggleEdit, 
  onUpdateAttendance, 
  onViewEmployee,
  height = 600
}) => {
  const Row = ({ index, style }) => {
    const employee = employees[index];
    return (
      <div style={style}>
        <table className="w-full">
          <tbody>
            <AttendanceOnlyRow
              employee={employee}
              formatNumber={formatNumber}
              getCellColor={getCellColor}
              editMode={editMode}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleEdit={onToggleEdit}
              onUpdateAttendance={onUpdateAttendance}
              onViewEmployee={onViewEmployee}
            />
          </tbody>
        </table>
      </div>
    );
  };

  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired
  };

  if (employees.length < 50) {
    return null;
  }

  return (
    <List
      height={height}
      itemCount={employees.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};

VirtualAttendanceTable.propTypes = {
  employees: PropTypes.array.isRequired,
  formatNumber: PropTypes.func.isRequired,
  getCellColor: PropTypes.func.isRequired,
  editMode: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onToggleEdit: PropTypes.func.isRequired,
  onUpdateAttendance: PropTypes.func.isRequired,
  onViewEmployee: PropTypes.func,
  height: PropTypes.number
};
