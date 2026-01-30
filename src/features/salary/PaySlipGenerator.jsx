import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Mail, Search } from 'lucide-react';
import { downloadPaySlip } from './payslipPDF';
import { useToastStore } from '../../stores/toastStore';

export const PaySlipGenerator = ({ employees, month, year }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmps, setSelectedEmps] = useState([]);
  const showToast = useToastStore(state => state.addToast);

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (emp) => {
    downloadPaySlip(emp, emp, { name: 'Company', branches: [{ address: 'Address' }] }, month, year);
    showToast('Pay slip downloaded', 'success');
  };

  const handleBulkDownload = () => {
    const emps = selectedEmps.length > 0 ? employees.filter(e => selectedEmps.includes(e.empId)) : employees;
    emps.forEach(emp => downloadPaySlip(emp, emp, { name: 'Company', branches: [{ address: 'Address' }] }, month, year));
    showToast(`${emps.length} pay slips downloaded`, 'success');
  };

  const toggleSelect = (empId) => {
    setSelectedEmps(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={handleBulkDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download {selectedEmps.length > 0 ? `${selectedEmps.length} Selected` : 'All'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <motion.div
            key={emp.empId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-700 rounded-lg p-4 border border-gray-200 dark:border-neutral-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedEmps.includes(emp.empId)}
                  onChange={() => toggleSelect(emp.empId)}
                  className="w-4 h-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{emp.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">{emp.empId}</p>
                </div>
              </div>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-neutral-400">Gross Salary</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{emp.gross?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-neutral-400">Net Salary</span>
                <span className="font-medium text-green-600">₹{emp.netSalary?.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(emp)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                className="px-3 py-2 bg-gray-100 dark:bg-neutral-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-500"
                title="Email pay slip"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
          No employees found
        </div>
      )}
    </div>
  );
};
