import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info } from 'lucide-react';

export const TaxCalculator = ({ employees }) => {
  const [selectedEmp, setSelectedEmp] = useState(employees[0]?.empId || '');

  const emp = employees.find(e => e.empId === selectedEmp);
  const annualGross = (emp?.gross || 0) * 12;
  const annualNet = (emp?.netSalary || 0) * 12;

  const calculateTax = (income) => {
    let tax = 0;
    if (income <= 250000) tax = 0;
    else if (income <= 500000) tax = (income - 250000) * 0.05;
    else if (income <= 750000) tax = 12500 + (income - 500000) * 0.1;
    else if (income <= 1000000) tax = 37500 + (income - 750000) * 0.15;
    else if (income <= 1250000) tax = 75000 + (income - 1000000) * 0.2;
    else if (income <= 1500000) tax = 125000 + (income - 1250000) * 0.25;
    else tax = 187500 + (income - 1500000) * 0.3;
    
    const cess = tax * 0.04;
    return tax + cess;
  };

  const oldRegimeTax = calculateTax(annualGross);
  const newRegimeTax = calculateTax(annualGross * 0.9); // Simplified
  const savings = oldRegimeTax - newRegimeTax;

  const taxSlabs = [
    { range: '₹0 - ₹2.5L', rate: '0%', tax: 0 },
    { range: '₹2.5L - ₹5L', rate: '5%', tax: 12500 },
    { range: '₹5L - ₹7.5L', rate: '10%', tax: 25000 },
    { range: '₹7.5L - ₹10L', rate: '15%', tax: 37500 },
    { range: '₹10L - ₹12.5L', rate: '20%', tax: 50000 },
    { range: '₹12.5L - ₹15L', rate: '25%', tax: 62500 },
    { range: 'Above ₹15L', rate: '30%', tax: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select
          value={selectedEmp}
          onChange={(e) => setSelectedEmp(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
        >
          {employees.map(e => (
            <option key={e.empId} value={e.empId}>{e.name} ({e.empId})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Annual Gross', value: annualGross, color: 'blue' },
          { label: 'Annual Net', value: annualNet, color: 'green' },
          { label: 'Estimated Tax', value: oldRegimeTax, color: 'red' }
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-${metric.color}-50 dark:bg-${metric.color}-900/20 p-6 rounded-lg`}
          >
            <p className="text-sm text-gray-600 dark:text-neutral-400">{metric.label}</p>
            <p className={`text-2xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400 mt-1`}>
              ₹{metric.value.toLocaleString('en-IN')}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Old Tax Regime
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-neutral-400">Taxable Income</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{annualGross.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-neutral-400">Tax Amount</span>
              <span className="font-medium text-red-600">₹{oldRegimeTax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-neutral-400">Take Home</span>
              <span className="font-medium text-green-600">₹{(annualNet - oldRegimeTax).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            New Tax Regime
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-neutral-400">Taxable Income</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{(annualGross * 0.9).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-neutral-400">Tax Amount</span>
              <span className="font-medium text-red-600">₹{newRegimeTax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-neutral-400">Take Home</span>
              <span className="font-medium text-green-600">₹{(annualNet - newRegimeTax).toLocaleString('en-IN')}</span>
            </div>
          </div>
          {savings > 0 && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">
                💰 Save ₹{savings.toLocaleString('en-IN')} with new regime
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Income Tax Slabs (FY 2024-25)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Income Range</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Tax Rate</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Max Tax</th>
              </tr>
            </thead>
            <tbody>
              {taxSlabs.map((slab, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-neutral-700">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-neutral-300">{slab.range}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-neutral-300">{slab.rate}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-neutral-300">
                    {slab.tax > 0 ? `₹${slab.tax.toLocaleString('en-IN')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-4">
          * Plus 4% Health & Education Cess on total tax
        </p>
      </motion.div>
    </div>
  );
};
