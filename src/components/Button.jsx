// Consistent button styles

export const BUTTON_STYLES = {
  primary: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors',
  secondary: 'px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors',
  success: 'px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors',
  danger: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors',
  warning: 'px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors',
  outline: 'px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors',
  ghost: 'px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors',
  link: 'text-blue-600 hover:text-blue-700 underline font-medium',
};

export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyle = BUTTON_STYLES[variant] || BUTTON_STYLES.primary;
  const sizeStyle = BUTTON_SIZES[size] || BUTTON_SIZES.md;
  
  return (
    <button 
      className={`${baseStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
