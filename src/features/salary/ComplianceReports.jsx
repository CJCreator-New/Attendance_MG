import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import ExcelJS from 'exceljs';

export const ComplianceReports = ({ employees, month, year }) => {
  const showToast = useToastStore(state => state.addToast);

  const epfEmployees = employees.filter(e => e.gross > 21000);
  const esiEmployees = employees.filter(e => e.gross <= 21000);
  const ptEmployees = employees.filter(e => (e.earnedGross || 0) > 21000);

  const totalEPF = epfEmployees.reduce((sum, e) => sum + (e.epf || 0), 0);
  const totalESI = esiEmployees.reduce((sum, e) => sum + (e.esi || 0), 0);
  const totalPT = ptEmployees.reduce((sum, e) => sum + (e.profTax || 0), 0);

  const exportReport = async (type) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type.toUpperCase());
    let filename = '';

    if (type === 'epf') {
      worksheet.columns = [
        { header: 'Employee ID', key: 'empId', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'UAN', key: 'uan', width: 20 },
        { header: 'Gross Salary', key: 'gross', width: 15 },
        { header: 'EPF Wages', key: 'epfWages', width: 15 },
        { header: 'EE Share (12%)', key: 'eeShare', width: 15 },
        { header: 'ER Share (12%)', key: 'erShare', width: 15 },
        { header: 'Total EPF', key: 'totalEpf', width: 15 }
      ];
      epfEmployees.forEach(e => {
        worksheet.addRow({
          empId: e.empId,
          name: e.name,
          uan: e.epfNo || 'N/A',
          gross: e.gross,
          epfWages: Math.min((e.basic || 0) + (e.da || 0), 15000),
          eeShare: e.epf || 0,
          erShare: e.epf || 0,
          totalEpf: (e.epf || 0) * 2
        });
      });
      filename = `EPF_Report_${month}_${year}.xlsx`;
    } else if (type === 'esi') {
      worksheet.columns = [
        { header: 'Employee ID', key: 'empId', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'ESI No', key: 'esiNo', width: 20 },
        { header: 'Gross Salary', key: 'gross', width: 15 },
        { header: 'ESI Wages', key: 'esiWages', width: 15 },
        { header: 'EE Share (0.75%)', key: 'eeShare', width: 18 },
        { header: 'ER Share (3.25%)', key: 'erShare', width: 18 },
        { header: 'Total ESI', key: 'totalEsi', width: 15 }
      ];
      esiEmployees.forEach(e => {
        worksheet.addRow({
          empId: e.empId,
          name: e.name,
          esiNo: e.esiNo || 'N/A',
          gross: e.gross,
          esiWages: e.earnedGross || 0,
          eeShare: e.esi || 0,
          erShare: (e.esi || 0) * 4.33,
          totalEsi: (e.esi || 0) * 5.33
        });
      });
      filename = `ESI_Report_${month}_${year}.xlsx`;
    } else if (type === 'pt') {
      worksheet.columns = [
        { header: 'Employee ID', key: 'empId', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Gross Salary', key: 'gross', width: 15 },
        { header: 'Earned Gross', key: 'earnedGross', width: 15 },
        { header: 'Professional Tax', key: 'profTax', width: 18 }
      ];
      ptEmployees.forEach(e => {
        worksheet.addRow({
          empId: e.empId,
          name: e.name,
          gross: e.gross,
          earnedGross: e.earnedGross || 0,
          profTax: e.profTax || 0
        });
      });
      filename = `PT_Report_${month}_${year}.xlsx`;
    }

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
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

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
