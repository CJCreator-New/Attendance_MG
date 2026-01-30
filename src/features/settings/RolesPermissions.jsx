import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Save, Plus, Edit2, Trash2 } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';

export const RolesPermissions = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', permissions: ['all'] },
    { id: 2, name: 'Manager', permissions: ['attendance', 'leave', 'reports'] },
    { id: 3, name: 'HR', permissions: ['employees', 'salary', 'leave'] },
    { id: 4, name: 'Employee', permissions: ['attendance', 'leave'] }
  ]);
  const showToast = useToastStore(state => state.addToast);

  const allPermissions = [
    { id: 'attendance', label: 'Attendance Management' },
    { id: 'leave', label: 'Leave Management' },
    { id: 'salary', label: 'Salary Management' },
    { id: 'employees', label: 'Employee Management' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
    { id: 'all', label: 'All Permissions' }
  ];

  const handleSave = () => {
    localStorage.setItem('roles', JSON.stringify(roles));
    showToast('Roles and permissions saved', 'success');
  };

  const togglePermission = (roleId, permId) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const perms = role.permissions.includes(permId)
          ? role.permissions.filter(p => p !== permId)
          : [...role.permissions, permId];
        return { ...role, permissions: perms };
      }
      return role;
    }));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-700 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Roles & Permissions
          </h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>

        <div className="space-y-4">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-gray-200 dark:border-neutral-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{role.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {role.permissions.includes('all') ? 'All permissions' : `${role.permissions.length} permissions`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allPermissions.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={role.permissions.includes(perm.id) || role.permissions.includes('all')}
                      onChange={() => togglePermission(role.id, perm.id)}
                      disabled={role.permissions.includes('all') && perm.id !== 'all'}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 dark:text-neutral-300">{perm.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
      >
        <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">📋 Permission Guidelines</h4>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <li>• Admin role has full access to all features</li>
          <li>• Manager can manage attendance, leave, and view reports</li>
          <li>• HR can manage employees, salary, and leave policies</li>
          <li>• Employee can only mark attendance and apply for leave</li>
        </ul>
      </motion.div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Permissions
        </button>
      </div>
    </div>
  );
};
