import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const SalaryTrends = ({ employees }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const trendData = months.map((month, idx) => ({
    month,
    gross: employees.reduce((sum, e) => sum + (e.gross || 0), 0) * (0.95 + Math.random() * 0.1),
    net: employees.reduce((sum, e) => sum + (e.netSalary || 0), 0) * (0.95 + Math.random() * 0.1),
    deductions: employees.reduce((sum, e) => sum + (e.totalDeduction || 0), 0) * (0.95 + Math.random() * 0.1)
  }));

  const deptData = [
    { dept: 'Engineering', avgSalary: 45000, count: 12 },
    { dept: 'Sales', avgSalary: 38000, count: 8 },
    { dept: 'HR', avgSalary: 35000, count: 5 },
    { dept: 'Finance', avgSalary: 42000, count: 6 }
  ];

  const currentMonth = trendData[trendData.length - 1];
  const prevMonth = trendData[trendData.length - 2];
  const growth = ((currentMonth.net - prevMonth.net) / prevMonth.net * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Avg Salary', value: (currentMonth.net / employees.length).toFixed(0), icon: DollarSign, color: 'blue' },
          { label: 'Growth Rate', value: `${growth}%`, icon: growth > 0 ? TrendingUp : TrendingDown, color: growth > 0 ? 'green' : 'red' },
          { label: 'Total Payroll', value: currentMonth.net.toFixed(0), icon: DollarSign, color: 'purple' }
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-${metric.color}-50 dark:bg-${metric.color}-900/20 p-6 rounded-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">{metric.label}</p>
                  <p className={`text-2xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400 mt-1`}>
                    {metric.label.includes('Rate') ? metric.value : `₹${Number(metric.value).toLocaleString('en-IN')}`}
                  </p>
                </div>
                <Icon className={`w-8 h-8 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Salary Trends (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="gross" stroke="#3b82f6" name="Gross Salary" strokeWidth={2} />
            <Line type="monotone" dataKey="net" stroke="#10b981" name="Net Salary" strokeWidth={2} />
            <Line type="monotone" dataKey="deductions" stroke="#ef4444" name="Deductions" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department-wise Salary Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="dept" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="avgSalary" fill="#3b82f6" name="Avg Salary" />
            <Bar dataKey="count" fill="#10b981" name="Employee Count" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
