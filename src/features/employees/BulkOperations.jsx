import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Trash2, Edit2, CheckSquare } from 'lucide-react';
import { saveToLocalStorage } from '../../utils/storage';
import { useToastStore } from '../../stores/toastStore';
import ExcelJS from 'exceljs';

export const BulkOperations = ({ employees, setEmployees }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const showToast = useToastStore(state => state.addToast);

  const toggleSelect = (empId) => {
    setSelectedIds(prev =>
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const selectAll = () => {
    setSelectedIds(selectedIds.length === employees.length ? [] : employees.map(e => e.empId));
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} employees?`)) {
      const updated = employees.filter(e => !selectedIds.includes(e.empId));
      setEmployees(updated);
      saveToLocalStorage({ employees: updated });
      showToast(`${selectedIds.length} employees deleted`, 'success');
      setSelectedIds([]);
    }
  };

  const handleBulkUpdate = () => {
    const field = prompt('Field to update (department/designation):');
    if (!field) return;
    const value = prompt(`New ${field}:`);
    if (!value) return;

    const updated = employees.map(e =>
      selectedIds.includes(e.empId) ? { ...e, [field]: value } : e
    );
    setEmployees(updated);
    saveToLocalStorage({ employees: updated });
    showToast(`${selectedIds.length} employees updated`, 'success');
    setSelectedIds([]);
  };

  const handleBulkExport = async () => {
    const selected = employees.filter(e => selectedIds.includes(e.empId));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Selected Employees');

    // Define columns
    worksheet.columns = [
      { header: 'Employee ID', key: 'empId', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Designation', key: 'designation', width: 15 },
      { header: 'Gross Salary', key: 'gross', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 }
    ];

    // Add data rows
    selected.forEach(e => {
      worksheet.addRow({
        empId: e.empId,
        name: e.name,
        department: e.department || 'General',
        designation: e.designation || 'Employee',
        gross: e.gross,
        email: e.email || '',
        phone: e.phone || ''
      });
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Selected_Employees.xlsx';
    link.click();
    URL.revokeObjectURL(url);

    showToast(`${selectedIds.length} employees exported`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={selectAll}
            className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            {selectedIds.length === employees.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-gray-600 dark:text-neutral-400">
            {selectedIds.length} selected
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBulkUpdate}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Update
          </button>
          <button
            onClick={handleBulkExport}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === employees.length}
                  onChange={selectAll}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Employee ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Department</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Designation</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-neutral-300">Salary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {employees.map((emp) => (
              <motion.tr
                key={emp.empId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`hover:bg-gray-50 dark:hover:bg-neutral-700 ${
                  selectedIds.includes(emp.empId) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.empId)}
                    onChange={() => toggleSelect(emp.empId)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{emp.empId}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{emp.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{emp.department || 'General'}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{emp.designation || 'Employee'}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">₹{emp.gross?.toLocaleString('en-IN')}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
          No employees available
        </div>
      )}
    </div>
  );
};
