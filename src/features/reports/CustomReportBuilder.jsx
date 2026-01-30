import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, Eye } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import * as XLSX from 'xlsx';

export const CustomReportBuilder = ({ employees }) => {
  const [selectedFields, setSelectedFields] = useState(['empId', 'name']);
  const [reportName, setReportName] = useState('Custom Report');
  const [filters, setFilters] = useState([]);
  const showToast = useToastStore(state => state.addToast);

  const availableFields = [
    { id: 'empId', label: 'Employee ID', category: 'Basic' },
    { id: 'name', label: 'Name', category: 'Basic' },
    { id: 'department', label: 'Department', category: 'Basic' },
    { id: 'designation', label: 'Designation', category: 'Basic' },
    { id: 'gross', label: 'Gross Salary', category: 'Salary' },
    { id: 'netSalary', label: 'Net Salary', category: 'Salary' },
    { id: 'totalEarnings', label: 'Total Earnings', category: 'Salary' },
    { id: 'totalDeduction', label: 'Total Deductions', category: 'Salary' },
    { id: 'presentDays', label: 'Present Days', category: 'Attendance' },
    { id: 'lossOfPay', label: 'Absent Days', category: 'Attendance' },
    { id: 'casualLeave', label: 'Casual Leave', category: 'Attendance' },
    { id: 'payableDays', label: 'Payable Days', category: 'Attendance' }
  ];

  const toggleField = (fieldId) => {
    setSelectedFields(prev =>
      prev.includes(fieldId) ? prev.filter(f => f !== fieldId) : [...prev, fieldId]
    );
  };

  const generateReport = () => {
    const data = employees.map(emp => {
      const row = {};
      selectedFields.forEach(field => {
        const fieldDef = availableFields.find(f => f.id === field);
        row[fieldDef.label] = emp[field] || 0;
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportName);
    XLSX.writeFile(wb, `${reportName}.xlsx`);
    showToast('Custom report generated', 'success');
  };

  const categories = [...new Set(availableFields.map(f => f.category))];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Report Name</label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-700 rounded-lg p-6"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{category} Fields</h4>
            <div className="space-y-2">
              {availableFields.filter(f => f.category === category).map((field) => (
                <label key={field.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => toggleField(field.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-neutral-300">{field.label}</span>
                </label>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-700 rounded-lg p-6"
      >
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Preview</h4>
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Selected Fields: {selectedFields.length} | Employees: {employees.length}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateReport}
            disabled={selectedFields.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};
