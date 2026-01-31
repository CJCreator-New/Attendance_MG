// Component Refactoring Guide

/**
 * GUIDELINES FOR BREAKING DOWN LARGE COMPONENTS
 * 
 * 1. Single Responsibility Principle
 *    - Each component should do ONE thing well
 *    - If a component has multiple concerns, split it
 * 
 * 2. Size Limits
 *    - Components > 300 lines should be reviewed
 *    - Components > 500 lines should be refactored
 * 
 * 3. Extract Patterns
 *    - Repeated JSX → New component
 *    - Complex logic → Custom hook
 *    - Calculations → Utility function
 * 
 * 4. Component Hierarchy
 *    - Container components (logic)
 *    - Presentational components (UI)
 *    - Utility components (reusable)
 */

// Example: Breaking down AttendanceSheet

// BEFORE: One large component (600+ lines)
// AttendanceSheet.jsx - Everything in one file

// AFTER: Multiple focused components

// 1. Container Component
// AttendanceSheet.jsx (200 lines) - State management, data fetching

// 2. Presentational Components
// AttendanceTable.jsx (150 lines) - Table rendering
// AttendanceRow.jsx (100 lines) - Single row
// AttendanceCell.jsx (50 lines) - Single cell

// 3. Feature Components
// AttendanceFilters.jsx (100 lines) - Search and filters
// AttendanceSummary.jsx (100 lines) - Summary statistics
// AttendanceActions.jsx (100 lines) - Bulk actions

// 4. Custom Hooks
// useAttendanceData.js (100 lines) - Data management
// useAttendanceFilters.js (50 lines) - Filter logic

export const REFACTORING_CHECKLIST = {
  componentSize: 'Is component < 300 lines?',
  singleResponsibility: 'Does component have one clear purpose?',
  reusability: 'Can parts be reused elsewhere?',
  testability: 'Is component easy to test?',
  readability: 'Is code easy to understand?',
  performance: 'Are there unnecessary re-renders?',
};

export const shouldRefactor = (component) => {
  // Simple heuristic: if component has more than 5 useState calls, consider refactoring
  const stateCount = (component.toString().match(/useState/g) || []).length;
  const lineCount = component.toString().split('\n').length;
  
  return stateCount > 5 || lineCount > 300;
};
