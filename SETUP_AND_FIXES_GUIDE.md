# Attendance Management System - Setup and Fixes Guide

This guide addresses all the critical issues found during testing and provides step-by-step instructions to fix them.

## Table of Contents
1. [Critical Issues Summary](#critical-issues-summary)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Fixes Applied](#fixes-applied)
5. [Verification Steps](#verification-steps)
6. [Troubleshooting](#troubleshooting)

---

## Critical Issues Summary

### Issues Fixed in Code
1. ✅ **Dashboard NaN/Incorrect Metrics** - Fixed division by zero and null checks
2. ✅ **Navigation Overflow** - Shortened labels and improved scrolling
3. ✅ **Download Template Feedback** - Added success/error toast notifications
4. ✅ **Leaves Collection Error Handling** - Graceful fallback when collection missing
5. ✅ **Month Service Error Handling** - Prevents crashes when no active month

### Issues Requiring Appwrite Setup
1. ⚠️ **Missing 'leaves' Collection** - Run setup script to create
2. ⚠️ **No Active Month Records** - Run init script to create
3. ⚠️ **Employee Data Persistence** - Verify Appwrite permissions

---

## Prerequisites

Before running the setup scripts, ensure you have:

1. **Appwrite CLI installed**:
   ```bash
   npm install -g appwrite-cli
   ```

2. **Logged into Appwrite**:
   ```bash
   appwrite login
   ```

3. **Project initialized**:
   ```bash
   appwrite init project --project-id 697dac94002f85b009ab
   ```

---

## Step-by-Step Setup

### Step 1: Create the 'leaves' Collection

**Windows:**
```batch
setup-leaves-collection.bat
```

**Linux/Mac:**
```bash
chmod +x setup-leaves-collection.sh
./setup-leaves-collection.sh
```

This creates the `leaves` collection with these attributes:
- `employeeId` (string, required)
- `employeeName` (string, required)
- `leaveType` (string, required)
- `startDate` (string, required)
- `endDate` (string, required)
- `days` (integer, required)
- `reason` (string, optional)
- `status` (string, required, default: pending)
- `appliedDate` (string, required)
- `approvedBy` (string, optional)
- `approvedDate` (string, optional)
- `remarks` (string, optional)

### Step 2: Initialize Default Data

Run the initialization script to create an active month:

```bash
node init-appwrite-data.js
```

This will:
- Check for an active month
- Create January 2026 as active month if none exists
- Verify all collections are accessible

### Step 3: Verify Collection Permissions

In the Appwrite Console, verify these collections have the correct permissions:

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| employees | any | users | users | users |
| attendance | any | users | users | users |
| months | any | users | users | users |
| leaves | any | users | users | users |
| salary-config | any | users | users | users |

**To update permissions:**
1. Go to Appwrite Console → Database → attendance-db
2. Select each collection
3. Go to "Settings" tab
4. Update Permissions

---

## Fixes Applied

### 1. Dashboard MetricsCards.jsx
**Problem:** NaN values when no employees, division by zero

**Fix:** Added null/undefined checks and safe division:
```javascript
const totalEmployees = employees?.length || 0;
const avgAttendance = totalEmployees > 0 
  ? employees.reduce((sum, emp) => sum + (emp.presentDays || 0), 0) / totalEmployees 
  : 0;
```

### 2. EmployeeAnalytics.jsx
**Problem:** Total Payroll showing ₹0 when it should show gross salary

**Fix:** Fallback to gross salary when netSalary is not available:
```javascript
const totalPayroll = employees?.reduce((sum, e) => sum + (e.netSalary || e.gross || 0), 0) || 0;
```

### 3. Navigation (MainLayout.jsx)
**Problem:** "Leave Management" too long, causing overflow

**Fix:** Shortened to "Leave" and added scrollbar styling:
```javascript
{ id: 'leave', label: 'Leave', icon: Umbrella, path: '/leave' }
```

### 4. LeaveService.js
**Problem:** App crashes when 'leaves' collection doesn't exist

**Fix:** Added try-catch with graceful fallback:
```javascript
static async getAllLeaves(queries = []) {
  try {
    // ... fetch logic
  } catch (error) {
    if (error.message?.includes('Collection with the requested ID')) {
      console.warn('Leaves collection not found. Returning empty array.');
      return [];
    }
    throw error;
  }
}
```

### 5. MonthService.js
**Problem:** Errors when fetching active month crash the app

**Fix:** Added error handling:
```javascript
static async getActiveMonth() {
  try {
    // ... fetch logic
  } catch (error) {
    console.error('Error fetching active month:', error);
    return null;
  }
}
```

### 6. EmployeeTemplate.js
**Problem:** No feedback when downloading template

**Fix:** Added toast notifications:
```javascript
export const downloadEmployeeTemplate = (showToast) => {
  try {
    // ... download logic
    if (showToast) showToast('Template downloaded successfully', 'success');
  } catch (error) {
    if (showToast) showToast('Failed to download template: ' + error.message, 'error');
  }
};
```

### 7. Dashboard.jsx
**Problem:** Generic error message when collections missing

**Fix:** Added specific warning for missing collections:
```javascript
if (error.message?.includes('Collection with the requested ID')) {
  showToast('Database setup incomplete. Please run setup scripts.', 'warning');
}
```

### 8. index.css
**Problem:** Navigation scrollbar visible and ugly

**Fix:** Added custom scrollbar styling:
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

---

## Verification Steps

After completing the setup, verify the fixes:

### 1. Test Dashboard
- Navigate to `/dashboard`
- Should show "0" for Total Employees (not NaN)
- Should show "0 days" for Avg Attendance (not NaN days)
- Should show "₹0" for Total Payroll

### 2. Test Employee Management
- Go to `/employees`
- Click "Download Template"
- Should show success toast
- File should download

### 3. Test Navigation
- Resize browser to smaller width
- Navigation should scroll horizontally
- All tabs should be accessible

### 4. Test Leaves Collection
- Go to `/leave`
- Should load without errors even if no data

### 5. Test Adding Employee
- Go to `/employees`
- Click "Add Employee"
- Fill in form and submit
- Employee should persist after page reload

---

## Troubleshooting

### Issue: "Collection with the requested ID 'leaves' could not be found"
**Solution:** Run the leaves collection setup script:
```bash
# Windows
setup-leaves-collection.bat

# Linux/Mac
./setup-leaves-collection.sh
```

### Issue: "No active month found"
**Solution:** Run the initialization script:
```bash
node init-appwrite-data.js
```

### Issue: Employee data not persisting
**Solution:** 
1. Check Appwrite Console → Database → employees → Settings
2. Verify permissions allow "Create" and "Update" for "users"
3. Check browser console for specific errors

### Issue: "Failed to load dashboard"
**Solution:** 
1. Verify all collections exist in Appwrite
2. Check that DATABASE_ID matches ('attendance-db')
3. Verify Appwrite endpoint is accessible

### Issue: Export button disabled
**Solution:** This is expected behavior when no employees exist. Add an employee first.

---

## Files Modified

1. `src/features/dashboard/MetricsCards.jsx` - Fixed NaN calculations
2. `src/features/employees/EmployeeAnalytics.jsx` - Fixed payroll calculation
3. `src/layouts/MainLayout.jsx` - Fixed navigation overflow
4. `src/services/leaveService.js` - Added error handling
5. `src/services/monthService.js` - Added error handling
6. `src/utils/employeeTemplate.js` - Added toast feedback
7. `src/features/dashboard/Dashboard.jsx` - Better error messages
8. `src/index.css` - Added scrollbar styling

## Files Created

1. `setup-leaves-collection.bat` - Windows script to create leaves collection
2. `setup-leaves-collection.sh` - Linux/Mac script to create leaves collection
3. `init-appwrite-data.js` - Node.js script to initialize default data
4. `SETUP_AND_FIXES_GUIDE.md` - This documentation

---

## Next Steps

1. Run the setup scripts to create missing collections
2. Initialize default data
3. Verify permissions in Appwrite Console
4. Test all functionality
5. Consider adding more robust error boundaries
6. Implement data seeding for testing

---

## Support

If issues persist after following this guide:
1. Check browser console for detailed error messages
2. Verify Appwrite project settings
3. Check network tab for failed API requests
4. Ensure all environment variables are correctly set
