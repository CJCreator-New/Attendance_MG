import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, User, Mail, Phone, Grid, List } from 'lucide-react';
import { EmployeeModal } from '../../components/EmployeeModal';
import { saveToLocalStorage } from '../../utils/storage';
import { useToastStore } from '../../stores/toastStore';

export const EmployeeDirectory = ({ employees, setEmployees, onSelectEmployee, viewMode, setViewMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const showToast = useToastStore(state => state.addToast);

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (empData) => {
    let updated;
    if (editingEmployee) {
      updated = employees.map(e => e.empId === empData.empId ? { ...e, ...empData } : e);
      showToast('Employee updated', 'success');
    } else {
      updated = [...employees, { ...empData, sno: employees.length + 1, attendance: new Array(31).fill('') }];
      showToast('Employee added', 'success');
    }
    setEmployees(updated);
    saveToLocalStorage({ employees: updated });
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleDelete = (empId) => {
    if (confirm('Delete this employee?')) {
      const updated = employees.filter(e => e.empId !== empId);
      setEmployees(updated);
      saveToLocalStorage({ employees: updated });
      showToast('Employee deleted', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}>
            <Grid className="w-5 h-5" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}>
            <List className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => { setEditingEmployee(null); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp, idx) => (
            <motion.div
              key={emp.empId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-neutral-700 rounded-lg p-6 border border-gray-200 dark:border-neutral-600 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectEmployee(emp)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{emp.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">{emp.empId}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 dark:text-neutral-400">{emp.designation || 'Employee'}</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">{emp.department || 'General'}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">₹{emp.gross?.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { setEditingEmployee(emp); setShowModal(true); }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.empId)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Employee ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300">Designation</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-neutral-300">Salary</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filtered.map((emp) => (
                <tr key={emp.empId} className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer" onClick={() => onSelectEmployee(emp)}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{emp.empId}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{emp.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{emp.department || 'General'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{emp.designation || 'Employee'}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">₹{emp.gross?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => { setEditingEmployee(emp); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 mr-3">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(emp.empId)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
          No employees found
        </div>
      )}

      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingEmployee(null); }}
        />
      )}
    </div>
  );
};
