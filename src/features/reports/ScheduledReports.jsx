import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Mail, Plus, Trash2, Play, Pause } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';

export const ScheduledReports = () => {
  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Monthly Attendance', type: 'attendance', frequency: 'Monthly', day: 1, time: '09:00', email: 'admin@company.com', active: true },
    { id: 2, name: 'Weekly Salary', type: 'salary', frequency: 'Weekly', day: 'Monday', time: '10:00', email: 'hr@company.com', active: true }
  ]);
  const [showForm, setShowForm] = useState(false);
  const showToast = useToastStore(state => state.addToast);

  const toggleSchedule = (id) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showToast('Schedule updated', 'success');
  };

  const deleteSchedule = (id) => {
    if (confirm('Delete this schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id));
      showToast('Schedule deleted', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scheduled Reports</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Schedule
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-700 rounded-lg p-6"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Create Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Report Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Report Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white">
                <option>Attendance</option>
                <option>Salary</option>
                <option>Leave</option>
                <option>Summary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Frequency</label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Time</label>
              <input type="time" className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Email Recipients</label>
              <input type="email" placeholder="email@example.com" className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Schedule</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-neutral-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-500">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {schedules.map((schedule, idx) => (
          <motion.div
            key={schedule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-neutral-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${schedule.active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'} rounded-lg flex items-center justify-center`}>
                  <Calendar className={`w-6 h-6 ${schedule.active ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{schedule.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {schedule.frequency} at {schedule.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {schedule.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSchedule(schedule.id)}
                  className={`p-2 rounded-lg ${schedule.active ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}
                  title={schedule.active ? 'Pause' : 'Resume'}
                >
                  {schedule.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteSchedule(schedule.id)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
          No scheduled reports. Create one to get started.
        </div>
      )}
    </div>
  );
};
