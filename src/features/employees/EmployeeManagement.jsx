import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Sparkles } from 'lucide-react';
import { EmployeeModal } from '../../components/EmployeeModal';
import { isDemoMode, disableDemoMode } from '../../utils/demoData';
import { toast } from '../../stores/toastStore';

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isDemo, setIsDemo] = useState(isDemoMode());

  const exitDemoMode = () => {
    disableDemoMode();
    setIsDemo(false);
    toast.success('Demo mode disabled. Add your employees now.');
  };

  useEffect(() => {
    const data = localStorage.getItem('attendanceData');
    if (data) {
      const parsed = JSON.parse(data);
      setEmployees(parsed.employees || []);
    }
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setShowModal(true);
  };

  const handleDelete = (empId) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      const updated = employees.filter(e => e.empId !== empId);
      setEmployees(updated);
      const data = JSON.parse(localStorage.getItem('attendanceData'));
      data.employees = updated;
      localStorage.setItem('attendanceData', JSON.stringify(data));
    }
  };

  const handleSave = (empData) => {
    let updated;
    if (editingEmployee) {
      updated = employees.map(e => e.empId === empData.empId ? { ...e, ...empData } : e);
    } else {
      updated = [...employees, { ...empData, sno: employees.length + 1 }];
    }
    setEmployees(updated);
    const data = JSON.parse(localStorage.getItem('attendanceData'));
    data.employees = updated;
    localStorage.setItem('attendanceData', JSON.stringify(data));
    setShowModal(false);
  };

  return (
    <div className="p-6">
      {isDemo && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-800">Demo Mode Active</p>
              <p className="text-sm text-yellow-700">These are sample employees. Exit demo mode to add your own employees.</p>
            </div>
          </div>
          <button
            onClick={exitDemoMode}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
          >
            Exit Demo Mode
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          Employee Management
        </h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-0 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold">S.No</th>
              <th className="text-left py-3 px-4 font-semibold">Employee ID</th>
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-right py-3 px-4 font-semibold">Gross Salary</th>
              <th className="text-center py-3 px-4 font-semibold">Opening CL</th>
              <th className="text-right py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredEmployees.map((emp, idx) => (
              <tr key={emp.empId} className="hover:bg-gray-50">
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4 font-mono">{emp.empId}</td>
                <td className="py-3 px-4 font-medium">{emp.name}</td>
                <td className="py-3 px-4 text-right">₹{emp.gross.toLocaleString()}</td>
                <td className="py-3 px-4 text-center">{emp.openingCL || 8}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(emp.empId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEmployees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No employees found
          </div>
        )}
      </div>

      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
