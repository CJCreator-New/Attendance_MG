import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import * as XLSX from 'xlsx';

export const ComplianceReports = ({ employees, month, year }) => {
  const showToast = useToastStore(state => state.addToast);

  const epfEmployees = employees.filter(e => e.gross > 21000);
  const esiEmployees = employees.filter(e => e.gross <= 21000);
  const ptEmployees = employees.filter(e => (e.earnedGross || 0) > 21000);

  const totalEPF = epfEmployees.reduce((sum, e) => sum + (e.epf || 0), 0);
  const totalESI = esiEmployees.reduce((sum, e) => sum + (e.esi || 0), 0);
  const totalPT = ptEmployees.reduce((sum, e) => sum + (e.profTax || 0), 0);

  const exportReport = (type) => {
    let data = [];
    let filename = '';

    if (type === 'epf') {
      data = epfEmployees.map(e => ({
        'Employee ID': e.empId,
        'Name': e.name,
        'UAN': e.epfNo || 'N/A',
        'Gross Salary': e.gross,
        'EPF Wages': Math.min((e.basic || 0) + (e.da || 0), 15000),
        'EE Share (12%)': e.epf || 0,
        'ER Share (12%)': e.epf || 0,
        'Total EPF': (e.epf || 0) * 2
      }));
      filename = `EPF_Report_${month}_${year}.xlsx`;
    } else if (type === 'esi') {
      data = esiEmployees.map(e => ({
        'Employee ID': e.empId,
        'Name': e.name,
        'ESI No': e.esiNo || 'N/A',
        'Gross Salary': e.gross,
        'ESI Wages': e.earnedGross || 0,
        'EE Share (0.75%)': e.esi || 0,
        'ER Share (3.25%)': (e.esi || 0) * 4.33,
        'Total ESI': (e.esi || 0) * 5.33
      }));
      filename = `ESI_Report_${month}_${year}.xlsx`;
    } else if (type === 'pt') {
      data = ptEmployees.map(e => ({
        'Employee ID': e.empId,
        'Name': e.name,
        'Gross Salary': e.gross,
        'Earned Gross': e.earnedGross || 0,
        'Professional Tax': e.profTax || 0
      }));
      filename = `PT_Report_${month}_${year}.xlsx`;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type.toUpperCase());
    XLSX.writeFile(wb, filename);
    showToast(`${type.toUpperCase()} report downloaded`, 'success');
  };

  const reports = [
    {
      title: 'EPF Report',
      type: 'epf',
      icon: FileText,
      color: 'blue',
      employees: epfEmployees.length,
      amount: totalEPF * 2,
      description: 'Employees Provident Fund contribution report'
    },
    {
      title: 'ESI Report',
      type: 'esi',
      icon: FileText,
      color: 'green',
      employees: esiEmployees.length,
      amount: totalESI * 5.33,
      description: 'Employee State Insurance contribution report'
    },
    {
      title: 'PT Report',
      type: 'pt',
      icon: FileText,
      color: 'purple',
      employees: ptEmployees.length,
      amount: totalPT,
      description: 'Professional Tax deduction report'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-${report.color}-50 dark:bg-${report.color}-900/20 rounded-lg p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-neutral-400 mt-1">{report.description}</p>
                </div>
                <Icon className={`w-6 h-6 text-${report.color}-600 dark:text-${report.color}-400`} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Employees</span>
                  <span className="font-medium text-gray-900 dark:text-white">{report.employees}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Total Amount</span>
                  <span className={`font-bold text-${report.color}-600 dark:text-${report.color}-400`}>
                    ₹{report.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => exportReport(report.type)}
                className={`w-full px-4 py-2 bg-${report.color}-600 text-white rounded-lg hover:bg-${report.color}-700 flex items-center justify-center gap-2`}
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Compliance Summary for {month} {year}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">EPF Compliance</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-neutral-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {epfEmployees.length} employees covered
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Employee contribution: ₹{totalEPF.toLocaleString('en-IN')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Employer contribution: ₹{totalEPF.toLocaleString('en-IN')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Due date: 15th of next month
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">ESI Compliance</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-neutral-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {esiEmployees.length} employees covered
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Employee contribution: ₹{totalESI.toLocaleString('en-IN')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Employer contribution: ₹{(totalESI * 4.33).toLocaleString('en-IN')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Due date: 21st of next month
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
      >
        <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">📋 Important Notes</h4>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <li>• EPF applicable for employees with gross salary &gt; ₹21,000</li>
          <li>• ESI applicable for employees with gross salary ≤ ₹21,000</li>
          <li>• Professional Tax deducted when earned gross &gt; ₹21,000</li>
          <li>• All reports are generated based on current month's attendance</li>
          <li>• Ensure timely payment to avoid penalties</li>
        </ul>
      </motion.div>
    </div>
  );
};
