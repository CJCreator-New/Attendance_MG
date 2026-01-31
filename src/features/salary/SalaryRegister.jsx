import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { downloadPaySlip } from './payslipPDF';
import ExcelJS from 'exceljs';
import { useToastStore } from '../../stores/toastStore';

export const SalaryRegister = ({ employees, month, year }) => {
  const showToast = useToastStore(state => state.addToast);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownloadSlip = (employee) => {
    downloadPaySlip(employee, employee, { name: 'Company', branches: [{ address: 'Address' }] }, month, year);
    showToast('Pay slip downloaded', 'success');
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Salary Register');

    // Add headers
    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Emp ID', key: 'empId', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Payable Days', key: 'payableDays', width: 14 },
      { header: 'Gross', key: 'gross', width: 15 },
      { header: 'Earnings', key: 'earnings', width: 15 },
      { header: 'Deductions', key: 'deductions', width: 15 },
      { header: 'Net Salary', key: 'netSalary', width: 15 }
    ];

    // Add data rows
    employees.forEach((emp, idx) => {
      worksheet.addRow({
        sno: idx + 1,
        empId: emp.empId,
        name: emp.name,
        payableDays: emp.payableDays || 0,
        gross: emp.gross,
        earnings: emp.totalEarnings || 0,
        deductions: emp.totalDeduction || 0,
        netSalary: emp.netSalary || 0
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
    link.download = `Salary_Register_${month}_${year}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Salary register exported', 'success');
  };

  const totals = employees.reduce((acc, emp) => ({
    gross: acc.gross + (emp.gross || 0),
    earnings: acc.earnings + (emp.totalEarnings || 0),
    deductions: acc.deductions + (emp.totalDeduction || 0),
    net: acc.net + (emp.netSalary || 0)
  }), { gross: 0, earnings: 0, deductions: 0, net: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Salary Register - {month} {year}</h2>
          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">{employees.length} employees</p>
        </div>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">S.No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Emp ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Name</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-neutral-300">Payable Days</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-neutral-300">Gross</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-neutral-300">Earnings</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-neutral-300">Deductions</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-neutral-300">Net Salary</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-neutral-300">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {employees.map((emp, idx) => (
              <tr key={emp.empId} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{idx + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{emp.empId}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{emp.name}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{emp.payableDays || 0}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(emp.gross)}</td>
                <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(emp.totalEarnings || 0)}</td>
                <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(emp.totalDeduction || 0)}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(emp.netSalary || 0)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDownloadSlip(emp)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Download Pay Slip"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 dark:bg-neutral-700 font-semibold">
            <tr>
              <td colSpan="4" className="px-4 py-3 text-sm text-gray-900 dark:text-white">Total</td>
              <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(totals.gross)}</td>
              <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(totals.earnings)}</td>
              <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(totals.deductions)}</td>
              <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(totals.net)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
};
