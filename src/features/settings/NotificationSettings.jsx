import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Save, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';

export const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      attendance: true,
      leave: true,
      salary: false,
      reports: true
    },
    sms: {
      enabled: false,
      attendance: false,
      leave: true,
      salary: false
    },
    push: {
      enabled: true,
      attendance: true,
      leave: true,
      salary: true,
      reports: false
    }
  });
  const showToast = useToastStore(state => state.addToast);

  const handleSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    showToast('Notification settings saved', 'success');
  };

  const channels = [
    { id: 'email', label: 'Email Notifications', icon: Mail, color: 'blue' },
    { id: 'sms', label: 'SMS Notifications', icon: MessageSquare, color: 'green' },
    { id: 'push', label: 'Push Notifications', icon: Smartphone, color: 'purple' }
  ];

  const events = [
    { id: 'attendance', label: 'Attendance Updates' },
    { id: 'leave', label: 'Leave Applications' },
    { id: 'salary', label: 'Salary Processing' },
    { id: 'reports', label: 'Report Generation' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-700 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Channels
        </h3>

        <div className="space-y-6">
          {channels.map((channel, idx) => {
            const Icon = channel.icon;
            return (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`border border-${channel.color}-200 dark:border-${channel.color}-800 rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${channel.color}-100 dark:bg-${channel.color}-900/30 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${channel.color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{channel.label}</h4>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {settings[channel.id].enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[channel.id].enabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        [channel.id]: { ...settings[channel.id], enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {settings[channel.id].enabled && (
                  <div className="grid grid-cols-2 gap-3 pl-13">
                    {events.map((event) => (
                      settings[channel.id][event.id] !== undefined && (
                        <label key={event.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[channel.id][event.id]}
                            onChange={(e) => setSettings({
                              ...settings,
                              [channel.id]: { ...settings[channel.id], [event.id]: e.target.checked }
                            })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700 dark:text-neutral-300">{event.label}</span>
                        </label>
                      )
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6"
      >
        <h4 className="font-medium text-yellow-900 dark:text-yellow-400 mb-2">⚠️ Important Notes</h4>
        <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
          <li>• Email notifications require SMTP configuration</li>
          <li>• SMS notifications require SMS gateway integration</li>
          <li>• Push notifications work only on supported browsers</li>
          <li>• Some notifications may be delayed during high traffic</li>
        </ul>
      </motion.div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
};
