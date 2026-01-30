import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Save, Plus, Trash2 } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';

export const SalaryStructure = () => {
  const [structure, setStructure] = useState({
    basic: 50,
    da: 25,
    hra: 25,
    epfRate: 12,
    esiRate: 0.75,
    profTax: 200,
    epfThreshold: 21000,
    esiThreshold: 21000
  });
  const [customComponents, setCustomComponents] = useState([
    { id: 1, name: 'Transport Allowance', type: 'earning', amount: 1000 },
    { id: 2, name: 'Medical Allowance', type: 'earning', amount: 1500 }
  ]);
  const showToast = useToastStore(state => state.addToast);

  const handleSave = () => {
    localStorage.setItem('salaryStructure', JSON.stringify({ structure, customComponents }));
    showToast('Salary structure saved', 'success');
  };

  const addComponent = () => {
    setCustomComponents([...customComponents, { id: Date.now(), name: '', type: 'earning', amount: 0 }]);
  };

  const removeComponent = (id) => {
    setCustomComponents(customComponents.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-700 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Standard Components (% of Gross)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Basic (%)</label>
            <input
              type="number"
              value={structure.basic}
              onChange={(e) => setStructure({ ...structure, basic: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">DA (%)</label>
            <input
              type="number"
              value={structure.da}
              onChange={(e) => setStructure({ ...structure, da: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">HRA (%)</label>
            <input
              type="number"
              value={structure.hra}
              onChange={(e) => setStructure({ ...structure, hra: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-700 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deduction Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">EPF Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={structure.epfRate}
              onChange={(e) => setStructure({ ...structure, epfRate: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">ESI Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={structure.esiRate}
              onChange={(e) => setStructure({ ...structure, esiRate: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Professional Tax (₹)</label>
            <input
              type="number"
              value={structure.profTax}
              onChange={(e) => setStructure({ ...structure, profTax: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">EPF Threshold (₹)</label>
            <input
              type="number"
              value={structure.epfThreshold}
              onChange={(e) => setStructure({ ...structure, epfThreshold: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-700 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Components</h3>
          <button onClick={addComponent} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Component
          </button>
        </div>
        <div className="space-y-3">
          {customComponents.map((comp) => (
            <div key={comp.id} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Component Name"
                value={comp.name}
                onChange={(e) => setCustomComponents(customComponents.map(c => c.id === comp.id ? { ...c, name: e.target.value } : c))}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
              <select
                value={comp.type}
                onChange={(e) => setCustomComponents(customComponents.map(c => c.id === comp.id ? { ...c, type: e.target.value } : c))}
                className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              >
                <option value="earning">Earning</option>
                <option value="deduction">Deduction</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={comp.amount}
                onChange={(e) => setCustomComponents(customComponents.map(c => c.id === comp.id ? { ...c, amount: Number(e.target.value) } : c))}
                className="w-32 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
              <button onClick={() => removeComponent(comp.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Structure
        </button>
      </div>
    </div>
  );
};
