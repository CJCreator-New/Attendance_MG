import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SALARY_CONSTANTS } from '../../constants';

export const SalaryComponentConfig = () => {
  const [config, setConfig] = useState({
    basicPercentage: SALARY_CONSTANTS.BASIC_PERCENTAGE * 100,
    daPercentage: SALARY_CONSTANTS.DA_PERCENTAGE * 100,
    hraPercentage: SALARY_CONSTANTS.HRA_PERCENTAGE * 100,
    epfRate: SALARY_CONSTANTS.EPF_RATE * 100,
    esiRate: SALARY_CONSTANTS.ESI_RATE * 100,
    profTax: SALARY_CONSTANTS.PROF_TAX_AMOUNT,
    epfThreshold: SALARY_CONSTANTS.EPF_THRESHOLD,
    esiThreshold: SALARY_CONSTANTS.ESI_THRESHOLD
  });

  const handleSave = () => {
    localStorage.setItem('salaryConfig', JSON.stringify(config));
    alert('Salary configuration saved! Restart app to apply changes.');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Salary Component Configuration</h2>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Basic (%)</label>
            <input type="number" value={config.basicPercentage} onChange={(e) => setConfig({...config, basicPercentage: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-2">DA (%)</label>
            <input type="number" value={config.daPercentage} onChange={(e) => setConfig({...config, daPercentage: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-2">HRA (%)</label>
            <input type="number" value={config.hraPercentage} onChange={(e) => setConfig({...config, hraPercentage: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-2">EPF Rate (%)</label>
            <input type="number" value={config.epfRate} onChange={(e) => setConfig({...config, epfRate: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-2">ESI Rate (%)</label>
            <input type="number" value={config.esiRate} onChange={(e) => setConfig({...config, esiRate: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-2">Professional Tax (₹)</label>
            <input type="number" value={config.profTax} onChange={(e) => setConfig({...config, profTax: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-2">EPF Threshold (₹)</label>
            <input type="number" value={config.epfThreshold} onChange={(e) => setConfig({...config, epfThreshold: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-2">ESI Threshold (₹)</label>
            <input type="number" value={config.esiThreshold} onChange={(e) => setConfig({...config, esiThreshold: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <button onClick={handleSave} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save Configuration
        </button>
      </div>
    </div>
  );
};
