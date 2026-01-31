import { FileSpreadsheet } from 'lucide-react';

export const EmptyState = ({ 
  icon: Icon = FileSpreadsheet, 
  title = 'No Data', 
  message = 'No data available', 
  action, 
  actionText = 'Add New' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Icon className="w-16 h-16 text-gray-400 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
