import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Bell, AlertCircle, Info } from 'lucide-react';
import { itemVariants } from '../../animations/variants';

export const Announcements = () => {
  const announcements = [
    { id: 1, type: 'info', title: 'System Update', message: 'New features added to dashboard', time: '2 hours ago' },
    { id: 2, type: 'warning', title: 'Pending Approvals', message: '5 leave requests awaiting approval', time: '5 hours ago' },
    { id: 3, type: 'success', title: 'Payroll Processed', message: 'Monthly payroll completed successfully', time: '1 day ago' },
  ];

  const icons = {
    info: Info,
    warning: AlertCircle,
    success: Bell,
  };

  const colors = {
    info: 'text-blue-600 bg-blue-50',
    warning: 'text-yellow-600 bg-yellow-50',
    success: 'text-green-600 bg-green-50',
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold">Announcements</h3>
      </div>
      <div className="space-y-3">
        {announcements.map((item) => {
          const Icon = icons[item.type];
          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors[item.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.message}</p>
                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
