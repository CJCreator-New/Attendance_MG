import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, DollarSign, Briefcase } from 'lucide-react';

export const EmployeeAnalytics = ({ employees }) => {
  const deptData = employees.reduce((acc, emp) => {
    const dept = emp.department || 'General';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const deptChartData = Object.entries(deptData).map(([name, value]) => ({ name, value }));

  const salaryRanges = [
    { range: '0-20K', min: 0, max: 20000, count: 0 },
    { range: '20K-40K', min: 20000, max: 40000, count: 0 },
    { range: '40K-60K', min: 40000, max: 60000, count: 0 },
    { range: '60K+', min: 60000, max: Infinity, count: 0 }
  ];

  employees.forEach(emp => {
    const range = salaryRanges.find(r => emp.gross >= r.min && emp.gross < r.max);
    if (range) range.count++;
  });

  const avgSalary = employees.reduce((sum, e) => sum + (e.gross || 0), 0) / employees.length || 0;
  const totalPayroll = employees.reduce((sum, e) => sum + (e.netSalary || 0), 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length, icon: Users, color: 'blue' },
          { label: 'Departments', value: Object.keys(deptData).length, icon: Briefcase, color: 'green' },
          { label: 'Avg Salary', value: `₹${avgSalary.toFixed(0)}`, icon: DollarSign, color: 'purple' },
          { label: 'Total Payroll', value: `₹${totalPayroll.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'orange' }
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-${metric.color}-50 dark:bg-${metric.color}-900/20 p-6 rounded-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">{metric.label}</p>
                  <p className={`text-2xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400 mt-1`}>
                    {metric.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deptChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deptChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Salary Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Earners</h3>
        <div className="space-y-3">
          {employees
            .sort((a, b) => (b.gross || 0) - (a.gross || 0))
            .slice(0, 5)
            .map((emp, idx) => (
              <div key={emp.empId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{emp.name}</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">{emp.empId} • {emp.designation || 'Employee'}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">₹{emp.gross?.toLocaleString('en-IN')}</p>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};
