import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';

export const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '', type: 'National' });

  useEffect(() => {
    const saved = localStorage.getItem('holidays');
    if (saved) setHolidays(JSON.parse(saved));
  }, []);

  const addHoliday = () => {
    if (!newHoliday.date || !newHoliday.name) return;
    const updated = [...holidays, { ...newHoliday, id: Date.now() }];
    setHolidays(updated);
    localStorage.setItem('holidays', JSON.stringify(updated));
    setNewHoliday({ date: '', name: '', type: 'National' });
  };

  const deleteHoliday = (id) => {
    const updated = holidays.filter(h => h.id !== id);
    setHolidays(updated);
    localStorage.setItem('holidays', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        Holiday Calendar
      </h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-semibold mb-4">Add New Holiday</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={newHoliday.date}
            onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Holiday Name"
            value={newHoliday.name}
            onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
            className="border rounded px-3 py-2"
          />
          <select
            value={newHoliday.type}
            onChange={(e) => setNewHoliday({...newHoliday, type: e.target.value})}
            className="border rounded px-3 py-2"
          >
            <option value="National">National</option>
            <option value="Regional">Regional</option>
            <option value="Company">Company</option>
          </select>
          <button
            onClick={addHoliday}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold">Date</th>
              <th className="text-left py-3 px-4 font-semibold">Holiday Name</th>
              <th className="text-left py-3 px-4 font-semibold">Type</th>
              <th className="text-right py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {holidays.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No holidays added yet
                </td>
              </tr>
            ) : (
              holidays.map((holiday) => (
                <tr key={holiday.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(holiday.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-medium">{holiday.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      holiday.type === 'National' ? 'bg-blue-100 text-blue-700' :
                      holiday.type === 'Regional' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {holiday.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteHoliday(holiday.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
