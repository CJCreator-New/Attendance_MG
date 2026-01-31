// Naming Conventions Guide

/**
 * COMPONENTS
 * - PascalCase for component names
 * - Descriptive, noun-based names
 * Examples: AttendanceSheet, EmployeeModal, LoadingSpinner
 */

/**
 * HOOKS
 * - camelCase starting with 'use'
 * - Descriptive of what they return/do
 * Examples: useDebounce, useUndoRedo, useToast
 */

/**
 * UTILITIES
 * - camelCase for functions
 * - Verb-based names for actions
 * Examples: calculateSalary, validateEmail, formatCurrency
 */

/**
 * CONSTANTS
 * - UPPER_SNAKE_CASE for true constants
 * - PascalCase for configuration objects
 * Examples: MAX_EMPLOYEES, ARIA_LABELS, BUTTON_STYLES
 */

/**
 * VARIABLES
 * - camelCase for local variables
 * - Descriptive, avoid abbreviations
 * Examples: employeeData, filteredResults, isLoading
 */

/**
 * EVENT HANDLERS
 * - Prefix with 'handle' or 'on'
 * - Describe the action
 * Examples: handleSubmit, onSave, handleFileUpload
 */

/**
 * BOOLEAN VARIABLES
 * - Prefix with 'is', 'has', 'should', 'can'
 * Examples: isLoading, hasChanges, shouldValidate, canEdit
 */

/**
 * FILES
 * - PascalCase for components: AttendanceSheet.jsx
 * - camelCase for utilities: dateUtils.js
 * - kebab-case for CSS: attendance-sheet.css
 */

export const NAMING_PATTERNS = {
  component: /^[A-Z][a-zA-Z0-9]*$/,
  hook: /^use[A-Z][a-zA-Z0-9]*$/,
  constant: /^[A-Z][A-Z0-9_]*$/,
  variable: /^[a-z][a-zA-Z0-9]*$/,
  handler: /^(handle|on)[A-Z][a-zA-Z0-9]*$/,
  boolean: /^(is|has|should|can)[A-Z][a-zA-Z0-9]*$/,
};

export const validateNaming = (name, type) => {
  return NAMING_PATTERNS[type]?.test(name) || false;
};
