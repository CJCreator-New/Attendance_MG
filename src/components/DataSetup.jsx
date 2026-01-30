import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Download, Upload, X } from 'lucide-react';
import { downloadSampleCSV, generateSampleExcel } from '../utils/sampleGenerator';

export const DataSetup = ({ onDataReady }) => {
  const [setupMode, setSetupMode] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <FileSpreadsheet className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management System</h1>
          <p className="text-gray-600">Choose how you want to set up your attendance data</p>
        </div>

        {!setupMode ? (
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setSetupMode('manual')}
              className="p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Plus className="w-12 h-12 mx-auto text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Manual Entry</h3>
              <p className="text-gray-600 text-sm">Set up month, employees, and attendance manually</p>
            </button>

            <button
              onClick={() => setSetupMode('import')}
              className="p-8 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <Upload className="w-12 h-12 mx-auto text-green-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Import File</h3>
              <p className="text-gray-600 text-sm">Upload Excel or CSV file with attendance data</p>
            </button>
          </div>
        ) : setupMode === 'manual' ? (
          <ManualSetup onComplete={onDataReady} onBack={() => setSetupMode(null)} />
        ) : (
          <ImportSetup onComplete={onDataReady} onBack={() => setSetupMode(null)} />
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Download Sample Templates</h4>
          <div className="flex gap-3">
            <button
              onClick={generateSampleExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <Download className="w-4 h-4" />
              Excel Template
            </button>
            <button
              onClick={downloadSampleCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Download className="w-4 h-4" />
              CSV Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManualSetup = ({ onComplete, onBack }) => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState([{ empId: '', name: '', gross: '', openingCL: 8 }]);

  const addEmployee = () => {
    setEmployees([...employees, { empId: '', name: '', gross: '', openingCL: 8 }]);
  };

  const updateEmployee = (index, field, value) => {
    const updated = [...employees];
    updated[index][field] = value;
    setEmployees(updated);
  };

  const removeEmployee = (index) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const daysInMonth = new Date(year, new Date(`${month} 1`).getMonth() + 1, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, new Date(`${month} 1`).getMonth(), i + 1));
    const days = dates.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));

    const data = {
      month: `${month} ${year}`,
      dates,
      days,
      employees: employees.map((emp, idx) => ({
        sno: idx + 1,
        empId: emp.empId,
        name: emp.name,
        gross: parseFloat(emp.gross) || 0,
        openingCL: parseFloat(emp.openingCL) || 8,
        attendance: new Array(daysInMonth).fill(''),
        presentDays: 0,
        paidHoliday: 0,
        weekOff: 0,
        onDuty: 0,
        casualLeave: 0,
        lossOfPay: 0,
        payableDays: 0,
        earnedGross: 0,
        basic: 0,
        da: 0,
        hra: 0,
        bonus: 0,
        otherAllowance: 0,
        ot: 0,
        totalEarnings: 0,
        epf: 0,
        esi: 0,
        profTax: 0,
        otherDeduction: 0,
        totalDeduction: 0,
        netSalary: 0
      }))
    };

    onComplete(data);
  };

  const isValid = month && employees.every(e => e.empId && e.name && e.gross);

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600 hover:text-blue-800">← Back</button>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select Month</option>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Employees</h3>
            <button onClick={addEmployee} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {employees.map((emp, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded">
                <input placeholder="ID" value={emp.empId} onChange={(e) => updateEmployee(idx, 'empId', e.target.value)} className="col-span-2 border rounded px-2 py-1 text-sm" />
                <input placeholder="Name" value={emp.name} onChange={(e) => updateEmployee(idx, 'name', e.target.value)} className="col-span-4 border rounded px-2 py-1 text-sm" />
                <input placeholder="Gross" type="number" value={emp.gross} onChange={(e) => updateEmployee(idx, 'gross', e.target.value)} className="col-span-3 border rounded px-2 py-1 text-sm" />
                <input placeholder="CL" type="number" value={emp.openingCL} onChange={(e) => updateEmployee(idx, 'openingCL', e.target.value)} className="col-span-2 border rounded px-2 py-1 text-sm" />
                <button onClick={() => removeEmployee(idx)} className="col-span-1 text-red-600 hover:text-red-800 text-sm">×</button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!isValid} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold">
          Create Attendance Sheet
        </button>
      </div>
    </div>
  );
};

const ImportSetup = ({ onComplete, onBack }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (!['xlsx', 'xls', 'csv'].includes(ext)) {
        setError('Please upload Excel (.xlsx, .xls) or CSV (.csv) file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      
      if (ext === 'csv') {
        const text = await file.text();
        const data = parseCSV(text);
        onComplete(data);
      } else {
        const XLSX = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const data = parseExcel(workbook, XLSX);
        onComplete(data);
      }
    } catch (err) {
      setError('Failed to parse file: ' + err.message);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',');
    
    const monthMatch = lines[1].split(',')[0];
    const month = monthMatch || 'Unknown';
    
    const employees = lines.slice(1).map((line, idx) => {
      const values = line.split(',');
      const attendance = values.slice(5, 36);
      
      return {
        sno: idx + 1,
        empId: values[1]?.trim() || '',
        name: values[2]?.trim() || '',
        gross: parseFloat(values[3]) || 0,
        openingCL: parseFloat(values[4]) || 8,
        attendance: attendance.map(a => a?.trim() || ''),
        presentDays: 0,
        paidHoliday: 0,
        weekOff: 0,
        onDuty: 0,
        casualLeave: 0,
        lossOfPay: 0,
        payableDays: 0,
        earnedGross: 0,
        basic: 0,
        da: 0,
        hra: 0,
        bonus: 0,
        otherAllowance: 0,
        ot: 0,
        totalEarnings: 0,
        epf: 0,
        esi: 0,
        profTax: 0,
        otherDeduction: 0,
        totalDeduction: 0,
        netSalary: 0
      };
    });

    const daysInMonth = 31;
    const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(2026, 0, i + 1));
    const days = dates.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));

    return { month, dates, days, employees };
  };

  const parseExcel = (workbook, XLSX) => {
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    const month = jsonData[0]?.[0] || 'Unknown';
    const daysInMonth = 31;
    const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(2026, 0, i + 1));
    const days = dates.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));

    const employees = jsonData.slice(1).filter(row => row[1]).map((row, idx) => ({
      sno: idx + 1,
      empId: row[1] || '',
      name: row[2] || '',
      gross: parseFloat(row[3]) || 0,
      openingCL: parseFloat(row[4]) || 8,
      attendance: row.slice(5, 36).map(a => a || ''),
      presentDays: 0,
      paidHoliday: 0,
      weekOff: 0,
      onDuty: 0,
      casualLeave: 0,
      lossOfPay: 0,
      payableDays: 0,
      earnedGross: 0,
      basic: 0,
      da: 0,
      hra: 0,
      bonus: 0,
      otherAllowance: 0,
      ot: 0,
      totalEarnings: 0,
      epf: 0,
      esi: 0,
      profTax: 0,
      otherDeduction: 0,
      totalDeduction: 0,
      netSalary: 0
    }));

    return { month, dates, days, employees };
  };

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600 hover:text-blue-800">← Back</button>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-blue-600 hover:text-blue-800 font-semibold">Choose file</span>
            <span className="text-gray-600"> or drag and drop</span>
          </label>
          <p className="text-sm text-gray-500 mt-2">Excel (.xlsx, .xls) or CSV (.csv)</p>
          {file && <p className="mt-3 text-sm font-medium text-green-600">Selected: {file.name}</p>}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <button onClick={handleImport} disabled={!file} className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold">
          Import & Continue
        </button>
      </div>
    </div>
  );
};
