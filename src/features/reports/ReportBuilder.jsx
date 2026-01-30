import React, { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { exportToExcel } from '../../utils/excelExport';

export const ReportBuilder = ({ employees, month, year }) => {
  const [reportType, setReportType] = useState('attendance');
  const [filters, setFilters] = useState({ department: 'all', status: 'all' });

  const generateAttendanceReport = () => {
    const report = employees.map(emp => ({
      'Employee ID': emp.empId,
      'Name': emp.name,
      'Present': emp.presentDays,
      'Absent': emp.lossOfPay,
      'CL': emp.casualLeave,
      'Week Off': emp.weekOff,
      'Paid Holiday': emp.paidHoliday,
      'On Duty': emp.onDuty,
      'Payable Days': emp.payableDays,
      'Attendance %': ((emp.presentDays / 31) * 100).toFixed(2) + '%'
    }));
    return report;
  };

  const generateLeaveReport = () => {
    return employees.map(emp => ({
      'Employee ID': emp.empId,
      'Name': emp.name,
      'Opening Balance': emp.openingCL,
      'CL Used': emp.casualLeave,
      'Remaining': (emp.openingCL - emp.casualLeave).toFixed(1),
      'Status': emp.casualLeave > emp.openingCL ? 'Exceeded' : 'Within Limit'
    }));
  };

  const generateSalaryReport = () => {
    return employees.map(emp => ({
      'Employee ID': emp.empId,
      'Name': emp.name,
      'Gross Salary': emp.gross,
      'Earned Gross': emp.earnedGross.toFixed(2),
      'Basic': emp.basic.toFixed(2),
      'DA': emp.da.toFixed(2),
      'HRA': emp.hra.toFixed(2),
      'Total Earnings': emp.totalEarnings.toFixed(2),
      'EPF': emp.epf.toFixed(2),
      'ESI': emp.esi.toFixed(2),
      'Prof Tax': emp.profTax.toFixed(2),
      'Total Deductions': emp.totalDeduction.toFixed(2),
      'Net Salary': emp.netSalary.toFixed(2)
    }));
  };

  const generateEPFReport = () => {
    return employees
      .filter(emp => emp.epf > 0)
      .map(emp => ({
        'Employee ID': emp.empId,
        'Name': emp.name,
        'Gross Salary': emp.gross,
        'EPF Base': Math.min(emp.basic + emp.da, 15000).toFixed(2),
        'Employee EPF (12%)': emp.epf.toFixed(2),
        'Employer EPF (12%)': emp.epf.toFixed(2),
        'Total EPF': (emp.epf * 2).toFixed(2)
      }));
  };

  const generateESIReport = () => {
    return employees
      .filter(emp => emp.esi > 0)
      .map(emp => ({
        'Employee ID': emp.empId,
        'Name': emp.name,
        'Gross Salary': emp.gross,
        'ESI Base': emp.earnedGross.toFixed(2),
        'Employee ESI (0.75%)': emp.esi.toFixed(2),
        'Employer ESI (3.25%)': (emp.earnedGross * 0.0325).toFixed(2),
        'Total ESI': (emp.esi + emp.earnedGross * 0.0325).toFixed(2)
      }));
  };

  const generateAbsenteeismReport = () => {
    return employees
      .filter(emp => emp.lossOfPay > 0)
      .sort((a, b) => b.lossOfPay - a.lossOfPay)
      .map(emp => ({
        'Employee ID': emp.empId,
        'Name': emp.name,
        'Department': emp.department || 'N/A',
        'Total Days': 31,
        'Absent Days': emp.lossOfPay,
        'Attendance %': ((emp.presentDays / 31) * 100).toFixed(2) + '%',
        'Status': emp.lossOfPay > 5 ? 'High Risk' : emp.lossOfPay > 2 ? 'Moderate' : 'Low'
      }));
  };

  const generateDepartmentReport = () => {
    const deptMap = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Unassigned';
      if (!deptMap[dept]) {
        deptMap[dept] = { count: 0, present: 0, absent: 0, cl: 0, totalSalary: 0 };
      }
      deptMap[dept].count++;
      deptMap[dept].present += emp.presentDays;
      deptMap[dept].absent += emp.lossOfPay;
      deptMap[dept].cl += emp.casualLeave;
      deptMap[dept].totalSalary += emp.netSalary;
    });
    return Object.entries(deptMap).map(([dept, data]) => ({
      'Department': dept,
      'Employees': data.count,
      'Avg Present': (data.present / data.count).toFixed(1),
      'Avg Absent': (data.absent / data.count).toFixed(1),
      'Avg CL': (data.cl / data.count).toFixed(1),
      'Attendance %': ((data.present / (data.count * 31)) * 100).toFixed(2) + '%',
      'Total Payroll': data.totalSalary.toFixed(2)
    }));
  };

  const handleExport = () => {
    let data, filename;
    
    switch(reportType) {
      case 'attendance':
        data = generateAttendanceReport();
        filename = `Attendance_Report_${month}_${year}`;
        break;
      case 'leave':
        data = generateLeaveReport();
        filename = `Leave_Report_${month}_${year}`;
        break;
      case 'salary':
        data = generateSalaryReport();
        filename = `Salary_Report_${month}_${year}`;
        break;
      case 'epf':
        data = generateEPFReport();
        filename = `EPF_Report_${month}_${year}`;
        break;
      case 'esi':
        data = generateESIReport();
        filename = `ESI_Report_${month}_${year}`;
        break;
      case 'absenteeism':
        data = generateAbsenteeismReport();
        filename = `Absenteeism_Report_${month}_${year}`;
        break;
      case 'department':
        data = generateDepartmentReport();
        filename = `Department_Report_${month}_${year}`;
        break;
      default:
        return;
    }

    exportToExcel(data, filename);
  };

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report', icon: '📊' },
    { value: 'leave', label: 'Leave Report', icon: '🏖️' },
    { value: 'salary', label: 'Salary Report', icon: '💰' },
    { value: 'epf', label: 'EPF Compliance', icon: '🏦' },
    { value: 'esi', label: 'ESI Compliance', icon: '🏥' },
    { value: 'absenteeism', label: 'Absenteeism Report', icon: '⚠️' },
    { value: 'department', label: 'Department Report', icon: '🏢' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-8 h-8" />
        Report Builder
      </h2>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div>
          <label className="block font-semibold mb-3 text-gray-700">Select Report Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  reportType === type.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-semibold">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Report Period: {month} {year}</span>
            </div>
            <div className="text-sm text-blue-700 mt-2">
              Total Employees: {employees.length}
            </div>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3 text-gray-700">Report Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
            <pre className="text-xs text-gray-700">
              {JSON.stringify(
                reportType === 'attendance' ? generateAttendanceReport().slice(0, 3) :
                reportType === 'leave' ? generateLeaveReport().slice(0, 3) :
                reportType === 'salary' ? generateSalaryReport().slice(0, 3) :
                reportType === 'epf' ? generateEPFReport().slice(0, 3) :
                reportType === 'esi' ? generateESIReport().slice(0, 3) :
                reportType === 'absenteeism' ? generateAbsenteeismReport().slice(0, 3) :
                generateDepartmentReport().slice(0, 3),
                null, 2
              )}
            </pre>
            <p className="text-xs text-gray-500 mt-2">Showing first 3 records...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
