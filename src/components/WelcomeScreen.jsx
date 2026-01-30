import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Building2, Users } from 'lucide-react';
import { generateDemoData, enableDemoMode } from '../utils/demoData';
import { useDataStore } from '../stores/dataStore';
import { Card } from './ui/Card';
import { fadeIn, containerVariants, itemVariants } from '../animations/variants';

export const WelcomeScreen = ({ onComplete }) => {
  const { initializeData } = useDataStore();

  const startDemo = () => {
    enableDemoMode();
    const demoData = generateDemoData();
    initializeData({ employees: demoData });
    onComplete();
  };

  const skipToSetup = () => {
    onComplete();
  };

  return (
    <motion.div
      {...fadeIn}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
    >
      <Card className="max-w-4xl w-full p-8" hover={false}>
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Attendance Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose how you'd like to get started
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={startDemo}
            className="group p-6 border-2 border-blue-200 hover:border-blue-500 rounded-xl transition-all hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <Users className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Explore with Demo Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Try the app with sample employees and data. Perfect for exploring features before adding your own data.
              </p>
            </div>
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={skipToSetup}
            className="group p-6 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                <Building2 className="w-6 h-6 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start Fresh
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Begin with a clean slate. Add your company details and employees from Settings or Employee Management.
              </p>
            </div>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
            💡 <strong>Tip:</strong> You can switch between demo and real data anytime from Settings
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
};
