// Accessibility utilities

export const ARIA_LABELS = {
  // Navigation
  DASHBOARD: 'Navigate to dashboard',
  ATTENDANCE: 'Navigate to attendance',
  EMPLOYEES: 'Navigate to employees',
  SALARY: 'Navigate to salary',
  LEAVE: 'Navigate to leave management',
  REPORTS: 'Navigate to reports',
  SETTINGS: 'Navigate to settings',
  
  // Actions
  SAVE: 'Save changes',
  EXPORT: 'Export to Excel',
  IMPORT: 'Import from Excel',
  PRINT: 'Print document',
  DELETE: 'Delete item',
  EDIT: 'Edit item',
  ADD: 'Add new item',
  SEARCH: 'Search',
  FILTER: 'Filter results',
  SORT: 'Sort by',
  
  // Attendance
  MARK_PRESENT: 'Mark as present',
  MARK_ABSENT: 'Mark as absent',
  MARK_LEAVE: 'Mark as leave',
  BULK_UPDATE: 'Bulk update attendance',
};

export const addAriaLabel = (element, label) => {
  if (!element) return;
  element.setAttribute('aria-label', label);
};

export const addAriaDescribedBy = (element, id) => {
  if (!element) return;
  element.setAttribute('aria-describedby', id);
};
