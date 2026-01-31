# Attendance Tab - Salary Information Removal

## Summary
Removed all salary-related information from the Attendance tab to ensure it displays only attendance-related data.

## Changes Made

### 1. SummaryReport Component (`src/components/SummaryReport.jsx`)
**Before:**
- Displayed Total Gross Salary
- Displayed Total Net Salary

**After:**
- Shows Total Present Days
- Shows Total Payable Days
- Removed salary calculations and formatCurrency function
- Removed DollarSign icon import

### 2. MobileAttendanceView Component (`src/components/MobileAttendanceView.jsx`)
**Before:**
- Displayed Gross Salary
- Displayed Net Salary

**After:**
- Shows Casual Leave (CL) count
- Shows Payable Days count
- Maintains Present and Absent counts

### 3. AttendanceOnlyRow Component (No changes needed)
Already displays only attendance data:
- Employee info (S.NO, Emp ID, Name, Gross)
- Attendance summary (Present, PH, WO, OD, CL, LOP, Payable)
- Daily attendance cells

### 4. AttendanceSheet Main Table (No changes needed)
Already configured correctly:
- Shows only attendance-related columns
- No salary breakdown columns (Basic, DA, HRA, EPF, ESI, etc.)
- Salary calculations happen in background but aren't displayed

## What's Still Visible in Attendance Tab

✅ **Employee Information:**
- Serial Number
- Employee ID
- Name
- Gross Salary (for reference only)

✅ **Attendance Summary:**
- Present Days
- Paid Holidays (PH)
- Week Offs (WO)
- On Duty (OD)
- Casual Leave (CL)
- Loss of Pay (LOP)
- Payable Days

✅ **Daily Attendance:**
- 31-day attendance grid
- Color-coded status indicators
- Inline editing capability

## What's Hidden from Attendance Tab

❌ **Salary Breakdown:**
- Basic Salary
- DA (Dearness Allowance)
- HRA (House Rent Allowance)
- Bonus
- Other Allowances
- Overtime (OT)
- Total Earnings

❌ **Deductions:**
- EPF (Employee Provident Fund)
- ESI (Employee State Insurance)
- Professional Tax
- Other Deductions
- Total Deductions

❌ **Net Salary:**
- Final calculated salary

## Where to View Salary Information

Salary details are now exclusively available in the **Salary tab** (`/salary` route), which requires the `canProcessPayroll` permission.

## Benefits

1. **Clear Separation of Concerns** - Attendance and Salary are distinct features
2. **Better UX** - Attendance tab is less cluttered and focused
3. **Security** - Salary information is restricted to authorized users only
4. **Performance** - Reduced data rendering in Attendance view
5. **Compliance** - Aligns with data privacy best practices
