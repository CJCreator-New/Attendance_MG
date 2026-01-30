import { useState, useEffect } from 'react';
import { Calculator, FileText, Download } from 'lucide-react';
import { useCompany } from '../settings/CompanyContext';
import { loadFromLocalStorage } from '../../utils/storage';
import { SalaryBreakdown } from './SalaryBreakdown';
import { SalaryRegister } from './SalaryRegister';
import { downloadPaySlip } from './payslipPDF';

export const SalaryCalculation = () => {
  const { currentCompany } = useCompany();
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeTab, setActiveTab] = useState('breakdown');

  useEffect(() => {
    const data = loadFromLocalStorage();
    if (data?.employees) {
      setEmployees(data.employees);
    }
  }, []);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const handleProcessSalary = () => {
    alert(`Salary processed for ${selectedMonth} ${selectedYear}`);
  };

  const handleDownloadAllSlips = () => {
    employees.forEach(emp => {
      downloadPaySlip(emp, emp, currentCompany, selectedMonth, selectedYear);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Salary Calculation</h2>
          <p className="text-gray-600 mt-1">Process and manage employee salaries</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payroll Summary</h3>
            <p className="text-sm text-gray-600 mt-1">{employees.length} employees • {selectedMonth} {selectedYear}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadAllSlips}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download All Slips
            </button>
            <button
              onClick={handleProcessSalary}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Process Salary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Gross</p>
            <p className="text-xl font-bold text-blue-600">
              ₹{employees.reduce((sum, emp) => sum + (emp.gross || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-xl font-bold text-green-600">
              ₹{employees.reduce((sum, emp) => sum + (emp.totalEarnings || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Deductions</p>
            <p className="text-xl font-bold text-red-600">
              ₹{employees.reduce((sum, emp) => sum + (emp.totalDeduction || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Net Payable</p>
            <p className="text-xl font-bold text-purple-600">
              ₹{employees.reduce((sum, emp) => sum + (emp.netSalary || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'breakdown'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Salary Breakdown
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'register'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Salary Register
        </button>
      </div>

      {activeTab === 'breakdown' && (
        <div className="space-y-6">
          {employees.map(emp => (
            <SalaryBreakdown key={emp.empId} employee={emp} salaryData={emp} />
          ))}
        </div>
      )}

      {activeTab === 'register' && (
        <SalaryRegister 
          employees={employees} 
          company={currentCompany}
          month={selectedMonth}
          year={selectedYear}
        />
      )}
    </div>
  );
};
