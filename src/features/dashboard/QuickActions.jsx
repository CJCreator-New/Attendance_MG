import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, Settings, Zap } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { icon: Calendar, label: 'Mark Attendance', path: '/attendance', color: 'blue' },
    { icon: Users, label: 'Manage Employees', path: '/employees', color: 'green' },
    { icon: FileText, label: 'Generate Reports', path: '/reports', color: 'purple' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'gray' }
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-bold">Quick Actions</h3>
      </div>
      <div className="space-y-2">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button
              key={idx}
              onClick={() => navigate(action.path)}
              variant="ghost"
              className="w-full justify-start gap-3"
            >
              <Icon className="w-5 h-5" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
