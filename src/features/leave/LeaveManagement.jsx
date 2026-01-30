import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, History, BarChart3 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { LeaveBalanceTracker } from './LeaveBalanceTracker';
import { LeaveApplicationForm } from './LeaveApplicationForm';
import { LeaveApprovalList } from './LeaveApprovalList';
import { LeaveAnalytics } from './LeaveAnalytics';
import { loadFromLocalStorage } from '../../utils/storage';
import { Card } from '../../components/ui/Card';
import { fadeIn } from '../../animations/variants';
import { toast } from '../../stores/toastStore';

export const LeaveManagement = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('balance');

  useEffect(() => {
    const data = loadFromLocalStorage();
    if (data?.employees) {
      setEmployees(data.employees);
    }

    const savedApps = localStorage.getItem('leave_applications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
  }, []);

  const handleApplyLeave = (employee) => {
    setSelectedEmployee(employee);
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = (appData) => {
    const newApp = {
      id: `leave_${Date.now()}`,
      status: 'Pending',
      appliedOn: new Date().toISOString(),
      ...appData
    };
    const updated = [...applications, newApp];
    setApplications(updated);
    localStorage.setItem('leave_applications', JSON.stringify(updated));
    setShowApplicationForm(false);
    toast.success('Leave application submitted successfully!');
  };

  const handleApprove = (appId) => {
    const updated = applications.map(app =>
      app.id === appId ? { ...app, status: 'Approved', approvedBy: user.name, approvedOn: new Date().toISOString() } : app
    );
    setApplications(updated);
    localStorage.setItem('leave_applications', JSON.stringify(updated));
    toast.success('Leave approved successfully!');
  };

  const handleReject = (appId, reason) => {
    const updated = applications.map(app =>
      app.id === appId ? { ...app, status: 'Rejected', rejectedBy: user.name, rejectedOn: new Date().toISOString(), rejectionReason: reason } : app
    );
    setApplications(updated);
    localStorage.setItem('leave_applications', JSON.stringify(updated));
    toast.error('Leave rejected');
  };

  const tabs = [
    { id: 'balance', label: 'Leave Balance', icon: Users },
    { id: 'history', label: 'Leave History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ...(user.permissions.canApproveLeaves ? [{ id: 'approvals', label: `Approvals (${applications.filter(a => a.status === 'Pending').length})`, icon: Calendar }] : [])
  ];

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage employee leave balances</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              className={`px-4 py-2 font-medium border-b-2 transition flex items-center gap-2 relative ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="leaveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {activeTab === 'balance' && (
        <div className="space-y-6">
          {employees.map((employee) => (
            <div key={employee.empId} className="relative">
              <LeaveBalanceTracker employee={employee} />
              <button
                onClick={() => handleApplyLeave(employee)}
                className="absolute top-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Apply Leave
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <h3 className="text-lg font-bold mb-4">Leave History</h3>
          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No leave applications yet</p>
            ) : (
              applications.map(app => (
                <motion.div
                  key={app.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{app.employeeName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {app.leaveType} - {app.fromDate} to {app.toDate} ({app.days} days)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Applied: {new Date(app.appliedOn).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <LeaveAnalytics employees={employees} />
      )}

      {activeTab === 'approvals' && user.permissions.canApproveLeaves && (
        <LeaveApprovalList
          applications={applications}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {showApplicationForm && selectedEmployee && (
        <LeaveApplicationForm
          employee={selectedEmployee}
          onSubmit={handleSubmitApplication}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </motion.div>
  );
};
