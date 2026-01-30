import React, { useState } from 'react';
import { Save } from 'lucide-react';

export const LeavePolicyConfig = () => {
  const [policy, setPolicy] = useState({
    openingBalance: 8,
    carryForward: true,
    maxCarryForward: 5,
    encashment: false,
    maxEncashment: 10
  });

  const handleSave = () => {
    localStorage.setItem('leavePolicy', JSON.stringify(policy));
    alert('Leave policy saved successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Leave Policy Configuration</h2>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block font-medium mb-2">Opening CL Balance (days)</label>
          <input type="number" value={policy.openingBalance} onChange={(e) => setPolicy({...policy, openingBalance: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={policy.carryForward} onChange={(e) => setPolicy({...policy, carryForward: e.target.checked})} />
          <label className="font-medium">Allow Carry Forward</label>
        </div>
        {policy.carryForward && (
          <div>
            <label className="block font-medium mb-2">Max Carry Forward (days)</label>
            <input type="number" value={policy.maxCarryForward} onChange={(e) => setPolicy({...policy, maxCarryForward: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={policy.encashment} onChange={(e) => setPolicy({...policy, encashment: e.target.checked})} />
          <label className="font-medium">Allow Leave Encashment</label>
        </div>
        {policy.encashment && (
          <div>
            <label className="block font-medium mb-2">Max Encashment (days)</label>
            <input type="number" value={policy.maxEncashment} onChange={(e) => setPolicy({...policy, maxEncashment: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
        )}
        <button onClick={handleSave} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save Policy
        </button>
      </div>
    </div>
  );
};
