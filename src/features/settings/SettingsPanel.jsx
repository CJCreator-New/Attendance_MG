import React, { useState } from 'react';
import { Settings, Building, Calendar, DollarSign, Umbrella, Users, Sparkles } from 'lucide-react';
import { BrandingSettings } from './BrandingSettings';
import { HolidayCalendar } from './HolidayCalendar';
import { SalaryComponentConfig } from '../salary/SalaryComponentConfig';
import { LeavePolicyConfig } from '../leave/LeavePolicyConfig';
import { UserManagement } from './UserManagement';
import { isDemoMode, disableDemoMode } from '../../utils/demoData';
import { toast } from '../../stores/toastStore';

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [isDemo, setIsDemo] = useState(isDemoMode());

  const exitDemoMode = () => {
    disableDemoMode();
    setIsDemo(false);
    toast.success('Demo mode disabled. You can now add your own data.');
  };

  const tabs = [
    { id: 'company', label: 'Company & Branding', icon: Building },
    { id: 'holidays', label: 'Holiday Calendar', icon: Calendar },
    { id: 'salary', label: 'Salary Config', icon: DollarSign },
    { id: 'leave', label: 'Leave Policy', icon: Umbrella },
    { id: 'users', label: 'User Management', icon: Users }
  ];

  return (
    <div className="p-6">
      {isDemo && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-800">Demo Mode Active</p>
              <p className="text-sm text-yellow-700">You're exploring with sample data. Exit demo mode to add your company details.</p>
            </div>
          </div>
          <button
            onClick={exitDemoMode}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
          >
            Exit Demo Mode
          </button>
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Settings className="w-8 h-8" />
        Settings
      </h1>
      
      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeTab === 'company' && <BrandingSettings />}
        {activeTab === 'holidays' && <HolidayCalendar />}
        {activeTab === 'salary' && <SalaryComponentConfig />}
        {activeTab === 'leave' && <LeavePolicyConfig />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};
