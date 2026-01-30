import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Building, DollarSign, Umbrella, Calendar, Shield, Bell, Plug } from 'lucide-react';
import { CompanySettings } from './CompanySettings';
import { SalaryStructure } from './SalaryStructure';
import { LeavePolicyConfig } from '../leave/LeavePolicyConfig';
import { HolidayCalendar } from './HolidayCalendar';
import { RolesPermissions } from './RolesPermissions';
import { NotificationSettings } from './NotificationSettings';
import { APIIntegrations } from './APIIntegrations';

export const SettingsPanelEnhanced = () => {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'salary', label: 'Salary Structure', icon: DollarSign },
    { id: 'leave', label: 'Leave Policy', icon: Umbrella },
    { id: 'holidays', label: 'Holidays', icon: Calendar },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API', icon: Plug }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Settings & Configuration
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">Manage system settings and preferences</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
          <div className="flex border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
          >
            {activeTab === 'company' && <CompanySettings />}
            {activeTab === 'salary' && <SalaryStructure />}
            {activeTab === 'leave' && <LeavePolicyConfig />}
            {activeTab === 'holidays' && <HolidayCalendar />}
            {activeTab === 'roles' && <RolesPermissions />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'api' && <APIIntegrations />}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
