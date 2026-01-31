import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, Users, DollarSign, Umbrella, TrendingUp } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const ReportTypes = ({ employees, month, year }) => {
  const showToast = useToastStore(state => state.addToast);

  const generateReport = async (type) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    let filename = '';

    if (type === 'attendance') {
      worksheet.columns = [
        { header: 'Employee ID', key: 'empId', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Present', key: 'present', width: 10 },
        { header: 'Absent', key: 'absent', width: 10 },
        { header: 'Leave', key: 'leave', width: 10 },
        { header: 'Week Off', key: 'weekOff', width: 12 },
        { header: 'Payable Days', key: 'payableDays', width: 14 }
      ];
      employees.forEach(e => {
        worksheet.addRow({
          empId: e.empId,
          name: e.name,
          present: e.presentDays || 0,
          absent: e.lossOfPay || 0,
          leave: e.casualLeave || 0,
          weekOff: e.weekOff || 0,
          payableDays: e.payableDays || 0
        });
      });
      filename = `Attendance_Report_${month}_${year}`;
    } else if (type === 'salary') {
      worksheet.columns = [
        { header: 'Employee ID', key: 'empId', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Gross', key: 'gross', width: 15 },
        { header: 'Earnings', key: 'earnings', width: 15 },
        { header: 'Deductions', key: 'deductions', width: 15 },
        { header: 'Net Salary', key: 'netSalary', width: 15 }
      ];
      employees.forEach(e => {
        worksheet.addRow({
          empId: e.empId,
          name: e.name,
          gross: e.gross,
          earnings: e.totalEarnings || 0,
          deductions: e.totalDeduction || 0,
          netSalary: e.netSalary || 0
        });
      });
      filename = `Salary_Report_${month}_${year}`;
    } else if (type === 'leave') {
      worksheet.columns = [
        { header: 'Employee ID', key: 'empId', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Opening CL', key: 'openingCL', width: 12 },
        { header: 'Used CL', key: 'usedCL', width: 12 },
        { header: 'Balance', key: 'balance', width: 12 }
      ];
      employees.forEach(e => {
        worksheet.addRow({
          empId: e.empId,
          name: e.name,
          openingCL: e.openingCL || 8,
          usedCL: e.casualLeave || 0,
          balance: (e.openingCL || 8) - (e.casualLeave || 0)
        });
      });
      filename = `Leave_Report_${month}_${year}`;
    } else if (type === 'summary') {
      worksheet.columns = [
        { header: 'Employee ID', key: 'empId', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Department', key: 'department', width: 15 },
        { header: 'Attendance', key: 'attendance', width: 15 },
        { header: 'Net Salary', key: 'netSalary', width: 15 }
      ];
      employees.forEach(e => {
        worksheet.addRow({
          empId: e.empId,
          name: e.name,
          department: e.department || 'General',
          attendance: `${e.presentDays || 0}/${e.payableDays || 0}`,
          netSalary: e.netSalary || 0
        });
      });
      filename = `Summary_Report_${month}_${year}`;
    } else {
      showToast('Invalid report type', 'error');
      return;
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
    link.download = `${filename}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Report generated', 'success');
  };

  const generatePDF = (type) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${type.toUpperCase()} REPORT`, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`${month} ${year}`, 105, 28, { align: 'center' });

    let tableData = [];
    let headers = [];

    // Use object lookup instead of switch
    const pdfGenerators = {
      attendance: () => {
        headers = ['Emp ID', 'Name', 'Present', 'Absent', 'Leave', 'Payable'];
        tableData = employees.map(e => [e.empId, e.name, e.presentDays || 0, e.lossOfPay || 0, e.casualLeave || 0, e.payableDays || 0]);
      },
      salary: () => {
        headers = ['Emp ID', 'Name', 'Gross', 'Earnings', 'Deductions', 'Net'];
        tableData = employees.map(e => [e.empId, e.name, e.gross, e.totalEarnings || 0, e.totalDeduction || 0, e.netSalary || 0]);
      }
    };

    const generator = pdfGenerators[type];
    if (generator) {
      generator();
    } else {
      showToast('Invalid PDF type', 'error');
      return;
    }

    doc.autoTable({
      startY: 35,
      head: [headers],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });

    doc.save(`${type}_report_${month}_${year}.pdf`);
    showToast('PDF generated', 'success');
  };

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', desc: 'Daily attendance summary', icon: Calendar, color: 'blue' },
    { id: 'salary', name: 'Salary Report', desc: 'Salary breakdown and totals', icon: DollarSign, color: 'green' },
    { id: 'leave', name: 'Leave Report', desc: 'Leave balance and usage', icon: Umbrella, color: 'purple' },
    { id: 'summary', name: 'Summary Report', desc: 'Overall employee summary', icon: TrendingUp, color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report, idx) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-${report.color}-50 dark:bg-${report.color}-900/20 rounded-lg p-6 border border-${report.color}-200 dark:border-${report.color}-800`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-${report.color}-100 dark:bg-${report.color}-900/30 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${report.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{report.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">{report.desc}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => generateReport(report.id)}
                  className={`flex-1 px-4 py-2 bg-${report.color}-600 text-white rounded-lg hover:bg-${report.color}-700 flex items-center justify-center gap-2`}
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={() => generatePDF(report.id)}
                  className={`flex-1 px-4 py-2 bg-${report.color}-600 text-white rounded-lg hover:bg-${report.color}-700 flex items-center justify-center gap-2`}
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Total Employees</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{employees.filter(e => (e.presentDays || 0) > 20).length}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Active</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">₹{employees.reduce((sum, e) => sum + (e.netSalary || 0), 0).toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Total Payroll</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{employees.reduce((sum, e) => sum + (e.casualLeave || 0), 0)}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Total Leaves</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
