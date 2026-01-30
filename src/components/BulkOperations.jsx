import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import { ATTENDANCE_CODE_LABELS } from '../constants';

export const BulkOperations = ({ onBulkUpdate, dates, days }) => {
  const [showMenu, setShowMenu] = useState(false);

  const markAllSundays = () => {
    const sundayIndices = days.map((day, idx) => day === 'Sun' ? idx : -1).filter(i => i !== -1);
    onBulkUpdate(sundayIndices, 'WO');
    setShowMenu(false);
  };

  const markPublicHoliday = () => {
    const dateIndex = prompt('Enter date (1-31) to mark as Public Holiday:');
    if (dateIndex && dateIndex > 0 && dateIndex <= dates.length) {
      onBulkUpdate([dateIndex - 1], 'PH');
    }
    setShowMenu(false);
  };

  const markAllPresent = () => {
    const allIndices = dates.map((_, idx) => idx);
    onBulkUpdate(allIndices, 'P');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Bulk Actions
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50" role="menu">
            <button
              onClick={markAllSundays}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-b"
              role="menuitem"
            >
              <Users className="w-4 h-4" />
              Mark All Sundays as WO
            </button>
            <button
              onClick={markPublicHoliday}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-b"
              role="menuitem"
            >
              <Calendar className="w-4 h-4" />
              Mark Public Holiday
            </button>
            <button
              onClick={markAllPresent}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              role="menuitem"
            >
              <Users className="w-4 h-4" />
              Mark All Present
            </button>
          </div>
        </>
      )}
    </div>
  );
};
