import React from 'react';
import { Download, Save, Upload, UserPlus, BarChart3, Printer } from 'lucide-react';
import { SearchFilter } from './SearchFilter';
import { BulkOperations } from './BulkOperations';
import { BulkEmployeeManager } from './BulkEmployeeManager';

export const AttendanceHeader = ({
  month,
  employeeCount,
  filteredCount,
  hasChanges,
  searchTerm,
  onSearchChange,
  onMonthChange,
  onSave,
  onExport,
  onImport,
  onAddEmployee,
  onShowSummary,
  onPrint,
  onBulkUpdate,
  onBulkAddEmployees,
  onBulkDeleteEmployees,
  employees,
  dates,
  days,
  fileInputRef
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">SALARY FOR THE MONTH OF {month}</h1>
            <p className="text-sm text-gray-600 mt-1">{filteredCount} of {employeeCount} Employees</p>
          </div>
          <div className="flex flex-wrap gap-3 no-print">
            {/* Primary Actions */}
            <div className="flex gap-2">
              <button
                onClick={onShowSummary}
                className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm"
                aria-label="View summary report"
              >
                <BarChart3 className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Summary</span>
              </button>
              <button
                onClick={onPrint}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm"
                aria-label="Print attendance sheet"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <button
                onClick={onAddEmployee}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm"
                aria-label="Add new employee"
              >
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Add</span>
              </button>
              <BulkEmployeeManager
                employees={employees}
                onBulkAdd={onBulkAddEmployees}
                onBulkDelete={onBulkDeleteEmployees}
              />
              {hasChanges && (
                <button
                  onClick={onSave}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm animate-pulse"
                  aria-label="Save changes"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              )}
              <BulkOperations
                onBulkUpdate={onBulkUpdate}
                dates={dates}
                days={days}
              />
            </div>

            {/* Import/Export Actions */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={onImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm"
                aria-label="Import Excel file"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={onExport}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm"
                aria-label="Export to Excel"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          currentMonth={month}
          onMonthChange={onMonthChange}
        />

        <div className="hidden md:flex flex-wrap gap-4 text-sm mt-4 no-print">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-100 border border-emerald-300 rounded"></div>
            <span className="text-gray-600">P - Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-rose-100 border border-rose-300 rounded"></div>
            <span className="text-gray-600">A - Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-100 border border-amber-300 rounded"></div>
            <span className="text-gray-600">CL - Casual Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-100 border border-slate-300 rounded"></div>
            <span className="text-gray-600">WO - Week Off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-100 border border-violet-300 rounded"></div>
            <span className="text-gray-600">PH - Public Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan-100 border border-cyan-300 rounded"></div>
            <span className="text-gray-600">OD - On Duty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-600">WFH - Work From Home</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-100 border border-orange-300 rounded"></div>
            <span className="text-gray-600">HCL - Half CL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-100 border border-teal-300 rounded"></div>
            <span className="text-gray-600">HP - Half Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-gray-600">HL - Half Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
};
