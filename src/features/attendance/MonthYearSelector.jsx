import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';

export const MonthYearSelector = ({ currentDate, onDateChange }) => {
  const handlePrevMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300">
      <Calendar className="w-4 h-4 text-gray-600" />
      <button
        onClick={handlePrevMonth}
        className="p-1 hover:bg-gray-100 rounded transition"
        title="Previous Month"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="font-semibold text-gray-900 min-w-[120px] text-center">
        {format(currentDate, 'MMMM yyyy')}
      </span>
      <button
        onClick={handleNextMonth}
        className="p-1 hover:bg-gray-100 rounded transition"
        title="Next Month"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={handleToday}
        className="ml-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition"
      >
        Today
      </button>
    </div>
  );
};
