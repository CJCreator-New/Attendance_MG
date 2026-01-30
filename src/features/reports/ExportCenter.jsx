import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const ExportCenter = ({ employees, month, year }) => {
  const showToast = useToastStore(state => state.addToast);

  const exportToExcel = (type) => {
    let data = [];
    let filename = '';

    switch(type) {
      case 'all':
        data = employees.map(e => ({
          'Employee ID': e.empId,
          'Name': e.name,
          'Department': e.department || 'General',
          'Gross': e.gross,
          'Present': e.presentDays || 0,
          'Absent': e.lossOfPay || 0,
          'Net Salary': e.netSalary || 0
        }));
        filename = `Complete_Data_${month}_${year}`;
        break;
      case 'attendance':
        data = employees.map(e => ({
          'Employee ID': e.empId,
          'Name': e.name,
          'Present': e.presentDays || 0,
          'Absent': e.lossOfPay || 0,
          'Leave': e.casualLeave || 0,
          'Payable': e.payableDays || 0
        }));
        filename = `Attendance_${month}_${year}`;
        break;
      case 'salary':
        data = employees.map(e => ({
          'Employee ID': e.empId,
          'Name': e.name,
          'Gross': e.gross,
          'Earnings': e.totalEarnings || 0,
          'Deductions': e.totalDeduction || 0,
          'Net': e.netSalary || 0
        }));
        filename = `Salary_${month}_${year}`;
        break;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
    showToast('Excel exported', 'success');
  };

  const exportToCSV = (type) => {
    let data = [];
    if (type === 'all') {
      data = employees.map(e => ({
        'Employee ID': e.empId,
        'Name': e.name,
        'Department': e.department || 'General',
        'Gross': e.gross,
        'Net Salary': e.netSalary || 0
      }));
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${month}_${year}.csv`;
    a.click();
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
