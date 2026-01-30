import React from 'react';
import { motion } from 'framer-motion';
import { Clock, UserCheck, UserX, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { itemVariants } from '../../animations/variants';

export const RecentActivity = ({ employees }) => {
  const activities = employees.slice(0, 8).map((emp, idx) => {
    const icons = [UserCheck, UserX, Calendar, Clock];
    const Icon = icons[idx % icons.length];
    return {
      name: emp.name,
      action: `${emp.presentDays} days present, ${emp.casualLeave} CL used`,
      time: 'Today',
      icon: Icon,
      color: emp.presentDays > 20 ? 'text-green-600' : 'text-yellow-600'
    };
  });

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold">Recent Activity</h3>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, idx) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon className={`w-5 h-5 ${activity.color}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activity.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
