import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Card = ({ children, className, hover = true, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={hover ? { y: -4 } : {}}
    className={cn(
      'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-shadow',
      hover && 'hover:shadow-lg',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);
