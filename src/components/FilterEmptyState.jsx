import { Filter } from 'lucide-react';

export const FilterEmptyState = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Filter className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        No items match your current filters. Try adjusting your search criteria.
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
