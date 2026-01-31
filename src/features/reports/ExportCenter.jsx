import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const ExportCenter = ({ employees, month, year }) => {
  const showToast = useToastStore(state => state.addToast);

  const exportToExcel = async (type) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    let filename = '';

    switch(type) {
      case 'all':
        worksheet.columns = [
          { header: 'Employee ID', key: 'empId', width: 15 },
          { header: 'Name', key: 'name', width: 25 },
          { header: 'Department', key: 'department', width: 15 },
          { header: 'Gross', key: 'gross', width: 15 },
          { header: 'Present', key: 'present', width: 10 },
          { header: 'Absent', key: 'absent', width: 10 },
          { header: 'Net Salary', key: 'netSalary', width: 15 }
        ];
        employees.forEach(e => {
          worksheet.addRow({
            empId: e.empId,
            name: e.name,
            department: e.department || 'General',
            gross: e.gross,
            present: e.presentDays || 0,
            absent: e.lossOfPay || 0,
            netSalary: e.netSalary || 0
          });
        });
        filename = `Complete_Data_${month}_${year}`;
        break;
      case 'attendance':
        worksheet.columns = [
          { header: 'Employee ID', key: 'empId', width: 15 },
          { header: 'Name', key: 'name', width: 25 },
          { header: 'Present', key: 'present', width: 10 },
          { header: 'Absent', key: 'absent', width: 10 },
          { header: 'Leave', key: 'leave', width: 10 },
          { header: 'Payable', key: 'payable', width: 10 }
        ];
        employees.forEach(e => {
          worksheet.addRow({
            empId: e.empId,
            name: e.name,
            present: e.presentDays || 0,
            absent: e.lossOfPay || 0,
            leave: e.casualLeave || 0,
            payable: e.payableDays || 0
          });
        });
        filename = `Attendance_${month}_${year}`;
        break;
      case 'salary':
        worksheet.columns = [
          { header: 'Employee ID', key: 'empId', width: 15 },
          { header: 'Name', key: 'name', width: 25 },
          { header: 'Gross', key: 'gross', width: 15 },
          { header: 'Earnings', key: 'earnings', width: 15 },
          { header: 'Deductions', key: 'deductions', width: 15 },
          { header: 'Net', key: 'net', width: 15 }
        ];
        employees.forEach(e => {
          worksheet.addRow({
            empId: e.empId,
            name: e.name,
            gross: e.gross,
            earnings: e.totalEarnings || 0,
            deductions: e.totalDeduction || 0,
            net: e.netSalary || 0
          });
        });
        filename = `Salary_${month}_${year}`;
        break;
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

    showToast('Excel exported', 'success');
  };

  const exportToCSV = (type) => {
    let csv = '';
    if (type === 'all') {
      csv = 'Employee ID,Name,Department,Gross,Net Salary\n';
      employees.forEach(e => {
        csv += `${e.empId},${e.name},${e.department || 'General'},${e.gross},${e.netSalary || 0}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${month}_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported', 'success');
  };

  const exportToPDF = (type) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${type.toUpperCase()} REPORT`, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`${month} ${year}`, 105, 28, { align: 'center' });

    let headers = [];
    let tableData = [];

    if (type === 'all') {
      headers = ['Emp ID', 'Name', 'Department', 'Gross', 'Net'];
      tableData = employees.map(e => [e.empId, e.name, e.department || 'General', e.gross, e.netSalary || 0]);
    }

    doc.autoTable({
      startY: 35,
      head: [headers],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });

    doc.save(`${type}_${month}_${year}.pdf`);
    showToast('PDF exported', 'success');
  };

  const exportOptions = [
    { id: 'all', name: 'Complete Data Export', desc: 'All employee data with attendance and salary', icon: FileSpreadsheet, color: 'blue' },
    { id: 'attendance', name: 'Attendance Export', desc: 'Attendance records only', icon: FileText, color: 'green' },
    { id: 'salary', name: 'Salary Export', desc: 'Salary information only', icon: File, color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportOptions.map((option, idx) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-${option.color}-50 dark:bg-${option.color}-900/20 rounded-lg p-6 border border-${option.color}-200 dark:border-${option.color}-800`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-${option.color}-100 dark:bg-${option.color}-900/30 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${option.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{option.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">{option.desc}</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => exportToExcel(option.id)}
                  className={`w-full px-4 py-2 bg-${option.color}-600 text-white rounded-lg hover:bg-${option.color}-700 flex items-center justify-center gap-2`}
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </button>
                <button
                  onClick={() => exportToCSV(option.id)}
                  className={`w-full px-4 py-2 bg-${option.color}-600 text-white rounded-lg hover:bg-${option.color}-700 flex items-center justify-center gap-2`}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => exportToPDF(option.id)}
                  className={`w-full px-4 py-2 bg-${option.color}-600 text-white rounded-lg hover:bg-${option.color}-700 flex items-center justify-center gap-2`}
                >
                  <Download className="w-4 h-4" />
                  Export PDF
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Total Records</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Export Formats</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{month}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Current Period</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{year}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Year</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
