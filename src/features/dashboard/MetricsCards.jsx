import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Umbrella, DollarSign } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { itemVariants } from '../../animations/variants';

export const MetricsCards = ({ employees }) => {
  const totalEmployees = employees?.length || 0;
  const avgAttendance = totalEmployees > 0 
    ? employees.reduce((sum, emp) => sum + (emp.presentDays || 0), 0) / totalEmployees 
    : 0;
  const totalLeaveUsed = employees?.reduce((sum, emp) => sum + (emp.casualLeave || 0), 0) || 0;
  const totalNetSalary = employees?.reduce((sum, emp) => sum + (emp.netSalary || 0), 0) || 0;

  const metrics = [
    { icon: Users, label: 'Total Employees', value: totalEmployees, color: 'blue' },
    { icon: Calendar, label: 'Avg Attendance', value: `${avgAttendance.toFixed(1)} days`, color: 'green' },
    { icon: Umbrella, label: 'Leave Used', value: `${totalLeaveUsed.toFixed(1)} days`, color: 'yellow' },
    { icon: DollarSign, label: 'Total Payroll', value: totalNetSalary > 0 ? `₹${(totalNetSalary / 1000).toFixed(0)}K` : '₹0', color: 'purple' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 text-${metric.color}-600`}
                >
                  <Icon className="w-full h-full" />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
