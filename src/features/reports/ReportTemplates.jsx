import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Edit2, Trash2, Copy, Star } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import * as XLSX from 'xlsx';

export const ReportTemplates = ({ employees }) => {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Monthly Summary', fields: ['empId', 'name', 'presentDays', 'netSalary'], favorite: true },
    { id: 2, name: 'Salary Breakdown', fields: ['empId', 'name', 'gross', 'totalEarnings', 'totalDeduction', 'netSalary'], favorite: false },
    { id: 3, name: 'Attendance Only', fields: ['empId', 'name', 'presentDays', 'lossOfPay', 'casualLeave', 'payableDays'], favorite: true }
  ]);
  const showToast = useToastStore(state => state.addToast);

  const fieldLabels = {
    empId: 'Employee ID',
    name: 'Name',
    department: 'Department',
    gross: 'Gross Salary',
    netSalary: 'Net Salary',
    presentDays: 'Present Days',
    lossOfPay: 'Absent Days',
    casualLeave: 'Casual Leave',
    payableDays: 'Payable Days',
    totalEarnings: 'Total Earnings',
    totalDeduction: 'Total Deductions'
  };

  const generateFromTemplate = (template) => {
    const data = employees.map(emp => {
      const row = {};
      template.fields.forEach(field => {
        row[fieldLabels[field]] = emp[field] || 0;
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, template.name);
    XLSX.writeFile(wb, `${template.name}.xlsx`);
    showToast('Report generated from template', 'success');
  };

  const toggleFavorite = (id) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));
  };

  const deleteTemplate = (id) => {
    if (confirm('Delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id));
      showToast('Template deleted', 'success');
    }
  };

  const duplicateTemplate = (template) => {
    const newTemplate = { ...template, id: Date.now(), name: `${template.name} (Copy)` };
    setTemplates([...templates, newTemplate]);
    showToast('Template duplicated', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Templates</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-neutral-700 rounded-lg p-6 border border-gray-200 dark:border-neutral-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{template.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">{template.fields.length} fields</p>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(template.id)}
                className={`p-1 ${template.favorite ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                <Star className="w-5 h-5" fill={template.favorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {template.fields.slice(0, 3).map(field => (
                  <span key={field} className="px-2 py-1 bg-gray-100 dark:bg-neutral-600 text-xs rounded">
                    {fieldLabels[field]}
                  </span>
                ))}
                {template.fields.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-600 text-xs rounded">
                    +{template.fields.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => generateFromTemplate(template)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Generate
              </button>
              <button
                onClick={() => duplicateTemplate(template)}
                className="p-2 bg-gray-200 dark:bg-neutral-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-500"
                title="Duplicate"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTemplate(template.id)}
                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
