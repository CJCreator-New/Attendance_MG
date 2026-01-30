export const SALARY_CONSTANTS = {
  BASIC_PERCENTAGE: 0.5,
  DA_PERCENTAGE: 0.25,
  HRA_PERCENTAGE: 0.25,
  EPF_RATE: 0.12,
  EPF_MAX_BASE: 15000,
  EPF_THRESHOLD: 21000,
  ESI_RATE: 0.0075,
  ESI_THRESHOLD: 21000,
  PROF_TAX_THRESHOLD: 21000,
  PROF_TAX_AMOUNT: 200,
  DAYS_IN_MONTH: 31,
  BONUS_PERCENTAGE: 0,
  OT_RATE: 0,
  OTHER_ALLOWANCE: 0,
  OTHER_DEDUCTION: 0
};

export const EXCEL_CONSTANTS = {
  DATE_ROW_START: 28,
  DATE_ROW_END: 59,
  DATA_START_ROW: 3,
  OPENING_CL_COLUMN: 27
};

export const STORAGE_CONSTANTS = {
  MAX_SIZE: 5000000,
  WARNING_THRESHOLD: 0.8,
  MAX_STORAGE_LIMIT: 10000000
};

export const VALIDATION_CONSTANTS = {
  MIN_SALARY: 1000,
  MAX_SALARY: 10000000,
  MAX_NAME_LENGTH: 100,
  MAX_EMPID_LENGTH: 20
};

export const ATTENDANCE_CODES = {
  PRESENT: 'P',
  ABSENT: 'A',
  CASUAL_LEAVE: 'CL',
  HALF_CL: 'HCL',
  HALF_PRESENT: 'HP',
  HALF_LEAVE: 'HL',
  WEEK_OFF: 'WO',
  WEEK_WEEK: 'WW',
  PUBLIC_HOLIDAY: 'PH',
  PAID_HOLIDAY: 'pH',
  PAID_HOLIDAY_WEEK: 'PHW',
  ON_DUTY: 'OD',
  WORK_FROM_HOME: 'WFH'
};

export const ATTENDANCE_CODE_LABELS = {
  'P': 'Present',
  'A': 'Absent',
  'CL': 'Casual Leave',
  'HCL': 'Half Casual Leave',
  'HP': 'Half Present',
  'HL': 'Half Leave',
  'WO': 'Week Off',
  'WW': 'Week Week',
  'PH': 'Public Holiday',
  'pH': 'Paid Holiday',
  'PHW': 'Paid Holiday Week',
  'OD': 'On Duty',
  'WFH': 'Work From Home'
};

export const ATTENDANCE_CODE_COLORS = {
  'P': 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900',
  'A': 'bg-rose-100 hover:bg-rose-200 text-rose-900',
  'CL': 'bg-amber-100 hover:bg-amber-200 text-amber-900',
  'HCL': 'bg-orange-100 hover:bg-orange-200 text-orange-900',
  'HP': 'bg-teal-100 hover:bg-teal-200 text-teal-900',
  'HL': 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900',
  'WO': 'bg-slate-100 hover:bg-slate-200 text-slate-900',
  'WW': 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  'PH': 'bg-violet-100 hover:bg-violet-200 text-violet-900',
  'pH': 'bg-purple-100 hover:bg-purple-200 text-purple-900',
  'PHW': 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900',
  'OD': 'bg-cyan-100 hover:bg-cyan-200 text-cyan-900',
  'WFH': 'bg-blue-100 hover:bg-blue-200 text-blue-900'
};
