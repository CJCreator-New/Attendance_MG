import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DOMPurify from 'dompurify';
import { VALIDATION_CONSTANTS } from '../constants';
import { validateEmployeeId } from '../utils/validation';

export const EmployeeModal = ({ employee, onSave, onClose }) => {
  const [formData, setFormData] = useState(employee || {
    empId: '',
    name: '',
    gross: '',
    epfNo: '',
    esiNo: ''
  });
  const [errors, setErrors] = useState({});

  const sanitize = (input) => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  };

  const validate = () => {
    const newErrors = {};
    
    const empIdValidation = validateEmployeeId(formData.empId);
    if (!empIdValidation.isValid) {
      newErrors.empId = empIdValidation.error;
    }
    
    if (!formData.name || !formData.name.trim()) newErrors.name = 'Name required';
    
    const gross = Number(formData.gross);
    if (!formData.gross || isNaN(gross) || gross <= 0) {
      newErrors.gross = 'Valid gross salary required';
    } else if (gross > VALIDATION_CONSTANTS.MAX_SALARY) {
      newErrors.gross = 'Salary must be less than ₹1,00,00,000';
    } else if (gross < VALIDATION_CONSTANTS.MIN_SALARY) {
      newErrors.gross = 'Salary seems too low';
    } else if (!Number.isInteger(gross)) {
      newErrors.gross = 'Salary must be a whole number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({ 
        ...formData, 
        empId: sanitize(formData.empId),
        name: sanitize(formData.name),
        epfNo: sanitize(formData.epfNo),
        esiNo: sanitize(formData.esiNo),
        gross: Number(formData.gross) 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee ID *</label>
            <input
              type="text"
              value={formData.empId}
              onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
              className="w-full border rounded px-3 py-2"
              disabled={!!employee}
            />
            {errors.empId && <p className="text-red-600 text-sm mt-1">{errors.empId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gross Salary *</label>
            <input
              type="number"
              value={formData.gross}
              onChange={(e) => setFormData({ ...formData, gross: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.gross && <p className="text-red-600 text-sm mt-1">{errors.gross}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">EPF No</label>
            <input
              type="text"
              value={formData.epfNo}
              onChange={(e) => setFormData({ ...formData, epfNo: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ESI No</label>
            <input
              type="text"
              value={formData.esiNo}
              onChange={(e) => setFormData({ ...formData, esiNo: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
            >
              {employee ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
