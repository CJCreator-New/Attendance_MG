import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { downloadPaySlip } from './payslipPDF';

export const SalaryBreakdown = ({ employees }) => {
  if (!employees || employees.length === 0) {
    return <div className="text-center py-12 text-gray-500 dark:text-neutral-400">No employees found</div>;
  }
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {employees.map((employee, idx) => (
    <motion.div
      key={employee.empId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white dark:bg-neutral-700 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{employee.name}</h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">{employee.empId} • {employee.designation || 'Employee'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-neutral-400">Net Salary</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(employee.netSalary)}</p>
          </div>
          <button
            onClick={() => downloadPaySlip(employee, employee, { name: 'Company', branches: [{ address: 'Address' }] }, 'January', 2026)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            title="Download Pay Slip"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Earnings</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">Gross Salary</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(employee.gross)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">Payable Days</span>
              <span className="font-medium text-gray-900 dark:text-white">{employee.payableDays || 0} / 31</span>
            </div>
            <div className="border-t border-gray-200 dark:border-neutral-600 pt-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-neutral-400">Earned Gross</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(employee.earnedGross)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-neutral-400">Basic (50%)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(employee.basic)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-neutral-400">DA (25%)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(employee.da)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-neutral-400">HRA (25%)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(employee.hra)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-neutral-600 pt-3 flex justify-between font-semibold">
              <span className="text-gray-900 dark:text-white">Total Earnings</span>
              <span className="text-green-600">{formatCurrency(employee.totalEarnings)}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Deductions</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">EPF (12%)</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(employee.epf)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">ESI (0.75%)</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(employee.esi)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">Professional Tax</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(employee.profTax)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-neutral-600 pt-3 flex justify-between font-semibold">
              <span className="text-gray-900 dark:text-white">Total Deductions</span>
              <span className="text-red-600">{formatCurrency(employee.totalDeduction)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-600 bg-green-50 dark:bg-green-900/20 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Net Salary</span>
          <span className="text-2xl font-bold text-green-600">{formatCurrency(employee.netSalary)}</span>
        </div>
      </div>
    </motion.div>
      ))}
    </div>
  );
};
