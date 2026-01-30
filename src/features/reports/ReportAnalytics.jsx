import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, TrendingUp, Clock } from 'lucide-react';

export const ReportAnalytics = ({ employees }) => {
  const monthlyData = [
    { month: 'Jan', reports: 45, downloads: 120 },
    { month: 'Feb', reports: 52, downloads: 135 },
    { month: 'Mar', reports: 48, downloads: 128 },
    { month: 'Apr', reports: 61, downloads: 156 },
    { month: 'May', reports: 55, downloads: 142 },
    { month: 'Jun', reports: 67, downloads: 178 }
  ];

  const reportTypes = [
    { type: 'Attendance', count: 145, percentage: 35 },
    { type: 'Salary', count: 120, percentage: 29 },
    { type: 'Leave', count: 85, percentage: 21 },
    { type: 'Summary', count: 62, percentage: 15 }
  ];

  const metrics = [
    { label: 'Total Reports', value: '412', icon: FileText, color: 'blue', change: '+12%' },
    { label: 'Downloads', value: '859', icon: Download, color: 'green', change: '+8%' },
    { label: 'Avg Time', value: '2.3s', icon: Clock, color: 'purple', change: '-15%' },
    { label: 'Success Rate', value: '98.5%', icon: TrendingUp, color: 'orange', change: '+2%' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-${metric.color}-50 dark:bg-${metric.color}-900/20 p-6 rounded-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">{metric.label}</p>
              <p className={`text-2xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400 mt-1`}>
                {metric.value}
              </p>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Generation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" name="Reports Generated" strokeWidth={2} />
              <Line type="monotone" dataKey="downloads" stroke="#10b981" name="Downloads" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="type" stroke="#9ca3af" />
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Reports</h3>
        <div className="space-y-3">
          {reportTypes.map((report, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{report.type} Report</p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">{report.count} generations</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{report.percentage}%</p>
                <div className="w-24 h-2 bg-gray-200 dark:bg-neutral-600 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${report.percentage}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
