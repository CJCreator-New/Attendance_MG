import React, { useState } from 'react';
import { Users, Trash2, X, Plus } from 'lucide-react';

export const BulkEmployeeManager = ({ employees, onBulkAdd, onBulkDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [bulkAddData, setBulkAddData] = useState('');

  const handleBulkAdd = () => {
    const lines = bulkAddData.trim().split('\n').filter(l => l.trim());
    const newEmployees = lines.map((line, idx) => {
      const [empId, name, gross, openingCL] = line.split(',').map(s => s.trim());
      return {
        empId: empId || `EMP${Date.now()}${idx}`,
        name: name || 'Unknown',
        gross: parseFloat(gross) || 0,
        openingCL: parseFloat(openingCL) || 8
      };
    });

    if (newEmployees.length > 0) {
      onBulkAdd(newEmployees);
      setBulkAddData('');
      setShowModal(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedEmployees.length > 0 && confirm(`Delete ${selectedEmployees.length} employees?`)) {
      onBulkDelete(selectedEmployees);
      setSelectedEmployees([]);
      setShowModal(false);
    }
  };

  const toggleEmployee = (empId) => {
    setSelectedEmployees(prev =>
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const selectAll = () => {
    setSelectedEmployees(employees.map(e => e.empId));
  };

  const deselectAll = () => {
    setSelectedEmployees([]);
  };

  return (
    <>
      <button
        onClick={() => { setShowModal(true); setMode(null); }}
        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm"
      >
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">Bulk</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Bulk Employee Management</h3>
              <button onClick={() => { setShowModal(false); setMode(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!mode ? (
              <div className="p-6 grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('add')}
                  className="p-8 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <Plus className="w-12 h-12 mx-auto text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-semibold mb-2">Bulk Add</h4>
                  <p className="text-sm text-gray-600">Add multiple employees at once</p>
                </button>

                <button
                  onClick={() => setMode('delete')}
                  className="p-8 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group"
                >
                  <Trash2 className="w-12 h-12 mx-auto text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-semibold mb-2">Bulk Delete</h4>
                  <p className="text-sm text-gray-600">Remove multiple employees</p>
                </button>
              </div>
            ) : mode === 'add' ? (
              <div className="p-6 flex-1 overflow-y-auto">
                <button onClick={() => setMode(null)} className="mb-4 text-blue-600 hover:text-blue-800">← Back</button>
                <p className="text-sm text-gray-600 mb-3">
                  Enter employee data (one per line): <strong>ID, Name, Gross Salary, Opening CL</strong>
                </p>
                <textarea
                  value={bulkAddData}
                  onChange={(e) => setBulkAddData(e.target.value)}
                  placeholder="EMP001, John Doe, 25000, 8&#10;EMP002, Jane Smith, 30000, 8&#10;EMP003, Bob Johnson, 22000, 8"
                  className="w-full h-64 border rounded-lg p-3 font-mono text-sm"
                />
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleBulkAdd}
                    disabled={!bulkAddData.trim()}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                  >
                    Add {bulkAddData.trim().split('\n').filter(l => l.trim()).length} Employees
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 flex-1 overflow-y-auto">
                <button onClick={() => setMode(null)} className="mb-4 text-blue-600 hover:text-blue-800">← Back</button>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">
                    Selected: <strong>{selectedEmployees.length}</strong> of {employees.length}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="text-sm text-blue-600 hover:text-blue-800">Select All</button>
                    <button onClick={deselectAll} className="text-sm text-gray-600 hover:text-gray-800">Clear</button>
                  </div>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-3">
                  {employees.map(emp => (
                    <label key={emp.empId} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.empId)}
                        onChange={() => toggleEmployee(emp.empId)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{emp.name}</div>
                        <div className="text-sm text-gray-600">ID: {emp.empId} | Gross: ₹{emp.gross}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedEmployees.length === 0}
                    className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                  >
                    Delete {selectedEmployees.length} Employees
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
