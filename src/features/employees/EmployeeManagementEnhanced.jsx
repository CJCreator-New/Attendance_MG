import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Upload, Download, BarChart3, FileText, Grid, List, FileSpreadsheet, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { EmployeeService } from '../../services/employeeService';
import { EmployeeDirectory } from './EmployeeDirectory';
import { EmployeeProfile } from './EmployeeProfile';
import { EmployeeAnalytics } from './EmployeeAnalytics';
import { BulkOperations } from './BulkOperations';
import { DocumentManager } from './DocumentManager';
import ExcelJS from 'exceljs';
import { useToastStore } from '../../stores/toastStore';
import { downloadEmployeeTemplate } from '../../utils/employeeTemplate';

export const EmployeeManagementEnhanced = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const showToast = useToastStore(state => state.addToast);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      showToast('Failed to load employees: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleImport = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];

      const data = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          const rowData = {};
          row.eachCell((cell, colNumber) => {
            const headerCell = worksheet.getRow(1).getCell(colNumber);
            const header = headerCell.value;
            rowData[header] = cell.value;
          });
          data.push(rowData);
        }
      });

      const imported = data.map((row, idx) => ({
        sno: employees.length + idx + 1,
        empId: DOMPurify.sanitize(String(row['Employee ID'] || row.empId || `EMP${Date.now() + idx}`), { ALLOWED_TAGS: [] }),
        name: DOMPurify.sanitize(String(row['Name'] || row.name || 'Unknown'), { ALLOWED_TAGS: [] }),
        gross: Number(row['Gross Salary'] || row.gross || 0),
        openingCL: Number(row['Opening CL'] || row.openingCL || 8),
        department: DOMPurify.sanitize(String(row['Department'] || row.department || 'General'), { ALLOWED_TAGS: [] }),
        designation: DOMPurify.sanitize(String(row['Designation'] || row.designation || 'Employee'), { ALLOWED_TAGS: [] }),
        email: DOMPurify.sanitize(String(row['Email'] || row.email || ''), { ALLOWED_TAGS: [] }),
        phone: DOMPurify.sanitize(String(row['Phone'] || row.phone || ''), { ALLOWED_TAGS: [] })
      }));

      const results = await EmployeeService.bulkCreateEmployees(imported);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      if (successful > 0) {
        showToast(`${successful} employees imported successfully${failed > 0 ? `, ${failed} failed` : ''}`, successful === imported.length ? 'success' : 'warning');
        await loadEmployees();
      } else {
        showToast('Import failed: ' + results[0]?.error, 'error');
      }
    } catch (error) {
      showToast('Import failed: ' + error.message, 'error');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  }, [employees.length, showToast, loadEmployees]);

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employees');

    // Define columns
    worksheet.columns = [
      { header: 'Employee ID', key: 'empId', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Designation', key: 'designation', width: 15 },
      { header: 'Gross Salary', key: 'gross', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Opening CL', key: 'openingCL', width: 12 }
    ];

    // Add data rows with sanitization
    employees.forEach(e => {
      worksheet.addRow({
        empId: DOMPurify.sanitize(String(e.empId || ''), { ALLOWED_TAGS: [] }),
        name: DOMPurify.sanitize(String(e.name || ''), { ALLOWED_TAGS: [] }),
        department: DOMPurify.sanitize(String(e.department || 'General'), { ALLOWED_TAGS: [] }),
        designation: DOMPurify.sanitize(String(e.designation || 'Employee'), { ALLOWED_TAGS: [] }),
        gross: Number(e.gross || 0),
        email: DOMPurify.sanitize(String(e.email || ''), { ALLOWED_TAGS: [] }),
        phone: DOMPurify.sanitize(String(e.phone || ''), { ALLOWED_TAGS: [] }),
        openingCL: Number(e.openingCL || 8)
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
    link.download = 'Employees.xlsx';
    link.click();
    URL.revokeObjectURL(url);

    showToast('Employees exported', 'success');
  };

  const tabs = [
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'bulk', label: 'Bulk Operations', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">
              {isLoading ? 'Loading...' : `${employees.length} employees`}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={downloadEmployeeTemplate} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Download Template
            </button>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" id="import" disabled={isImporting} />
            <label htmlFor="import" className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isImporting ? 'Importing...' : 'Import Excel'}
            </label>
            <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" disabled={employees.length === 0}>
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
          <div className="flex border-b border-gray-200 dark:border-neutral-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
          >
            {activeTab === 'directory' && (
              <EmployeeDirectory 
                employees={employees} 
                setEmployees={setEmployees}
                onSelectEmployee={setSelectedEmployee}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )}
            {activeTab === 'analytics' && <EmployeeAnalytics employees={employees} />}
            {activeTab === 'bulk' && <BulkOperations employees={employees} setEmployees={setEmployees} />}
            {activeTab === 'documents' && <DocumentManager employees={employees} />}
          </motion.div>
        </div>

        {selectedEmployee && (
          <EmployeeProfile 
            employee={selectedEmployee} 
            onClose={() => setSelectedEmployee(null)}
            onUpdate={async (updated) => {
              try {
                await EmployeeService.updateEmployee(updated.$id, updated);
                showToast('Employee updated successfully', 'success');
                await loadEmployees();
                setSelectedEmployee(null);
              } catch (error) {
                showToast('Failed to update employee: ' + error.message, 'error');
              }
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
