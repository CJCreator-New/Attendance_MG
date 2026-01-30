import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DOMPurify from 'dompurify';

const sanitizeName = (name) => {
  return DOMPurify.sanitize(name || '', { ALLOWED_TAGS: [] });
};

export const LeaveAnalytics = ({ employees }) => {
  if (!employees || employees.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Leave Analytics</h2>
        <p className="text-gray-500">No employee data available</p>
      </div>
    );
  }

  const leaveData = employees.map(emp => ({
    name: sanitizeName(emp.name).split(' ')[0] || 'Unknown',
    used: emp.casualLeave || 0,
    remaining: Math.max(0, (emp.openingCL || 0) - (emp.casualLeave || 0)),
    negative: Math.max(0, (emp.casualLeave || 0) - (emp.openingCL || 0))
  }));

  const summary = {
    totalUsed: employees.reduce((sum, emp) => sum + (emp.casualLeave || 0), 0),
    totalRemaining: employees.reduce((sum, emp) => sum + Math.max(0, (emp.openingCL || 0) - (emp.casualLeave || 0)), 0),
    negativeBalance: employees.filter(emp => (emp.casualLeave || 0) > (emp.openingCL || 0)).length
  };

  const pieData = [
    { name: 'Used', value: summary.totalUsed, color: '#ef4444' },
    { name: 'Remaining', value: summary.totalRemaining, color: '#10b981' }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Leave Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600 font-medium">Total Leave Used</div>
          <div className="text-3xl font-bold text-red-700">{summary.totalUsed.toFixed(1)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Total Remaining</div>
          <div className="text-3xl font-bold text-green-700">{summary.totalRemaining.toFixed(1)}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-600 font-medium">Negative Balance</div>
          <div className="text-3xl font-bold text-yellow-700">{summary.negativeBalance}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4">Leave Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4">Employee-wise Leave Balance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="used" fill="#ef4444" name="Used" />
              <Bar dataKey="remaining" fill="#10b981" name="Remaining" />
              {summary.negativeBalance > 0 && (
                <Bar dataKey="negative" fill="#f59e0b" name="Excess" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Employee</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Opening Balance</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Used</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Remaining</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map(emp => {
              const openingCL = emp.openingCL || 0;
              const casualLeave = emp.casualLeave || 0;
              const remaining = openingCL - casualLeave;
              return (
                <tr key={emp.empId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{sanitizeName(emp.name)}</td>
                  <td className="px-4 py-3 text-sm text-center">{openingCL}</td>
                  <td className="px-4 py-3 text-sm text-center">{casualLeave}</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold">{remaining.toFixed(1)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      remaining < 0 ? 'bg-red-100 text-red-700' :
                      remaining < 2 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {remaining < 0 ? 'Exceeded' : remaining < 2 ? 'Low' : 'Good'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
