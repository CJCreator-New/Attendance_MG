import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react';

export const EmployeeProfile = ({ employee, onClose, onUpdate }) => {
  if (!employee) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{employee.name}</h3>
                <p className="text-gray-600 dark:text-neutral-400">{employee.empId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Personal Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-neutral-400">{employee.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-neutral-400">{employee.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-neutral-400">{employee.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Employment Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-neutral-400">{employee.designation || 'Employee'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-neutral-400">{employee.department || 'General'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Joined: {employee.joinDate || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Salary Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Gross Salary</p>
                  <p className="text-lg font-bold text-blue-600">₹{employee.gross?.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Net Salary</p>
                  <p className="text-lg font-bold text-green-600">₹{employee.netSalary?.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Opening CL</p>
                  <p className="text-lg font-bold text-purple-600">{employee.openingCL || 8}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Payable Days</p>
                  <p className="text-lg font-bold text-orange-600">{employee.payableDays || 0}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Attendance Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Present</p>
                  <p className="text-xl font-bold text-green-600">{employee.presentDays || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Absent</p>
                  <p className="text-xl font-bold text-red-600">{employee.lossOfPay || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Leave</p>
                  <p className="text-xl font-bold text-yellow-600">{employee.casualLeave || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Week Off</p>
                  <p className="text-xl font-bold text-blue-600">{employee.weekOff || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
