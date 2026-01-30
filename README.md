# Attendance App

Flexible attendance management system with complete salary calculations - **no hardcoded data required**.

## ✨ Latest Updates (v2.1)

### 🎯 Major Changes
- ✅ **No Hardcoded Data** - Start fresh or import your data
- ✅ **Manual Entry** - Create attendance sheets from scratch
- ✅ **File Import** - Upload Excel or CSV files
- ✅ **Sample Templates** - Download pre-formatted templates
- ✅ **Flexible Setup** - Choose your preferred data input method

### 🔧 Previous Fixes (v2.0)
- ✅ **Complete Salary Calculations** - ESI, Bonus, OT, Other Allowances/Deductions
- ✅ **Fixed EPF Threshold** - Corrected to ₹21,000
- ✅ **Excel Date Conversion** - Proper handling of Excel serial numbers
- ✅ **Opening CL Parsing** - Reads from Excel column 27
- ✅ **Mobile UI Improved** - Beautiful modal instead of prompt()
- ✅ **All 13 Attendance Codes** - Complete support with labels
- ✅ **Data Validation** - Prevents future dates, invalid codes
- ✅ **Storage Quota Handling** - Graceful error handling
- ✅ **Excel Import Validation** - Comprehensive error checking

## Features

✅ **Flexible Data Setup** - Manual entry or file import (Excel/CSV)
✅ **Sample Templates** - Download pre-formatted templates
✅ **No Hardcoded Data** - Start fresh every time
✅ **Edit Attendance** - Click any cell to change attendance status
✅ **Auto-Calculate** - Salary calculations update automatically
✅ **Complete Salary Breakdown** - Basic, DA, HRA, EPF, ESI, PT, Bonus, OT
✅ **Color-Coded** - Visual indicators for different attendance types
✅ **Responsive Table** - Sticky headers for easy navigation
✅ **Mobile Optimized** - Touch-friendly UI with modal editor
✅ **Data Validation** - Prevents errors and invalid data
✅ **Storage Management** - Quota monitoring and error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the app:
```bash
npm run dev
```

3. First Launch:
   - Choose **Manual Entry** to create data from scratch
   - Or choose **Import File** to upload Excel/CSV
   - Download sample templates for reference

## Data Input Options

### Option 1: Manual Entry
1. Select month and year
2. Add employees (ID, Name, Gross Salary, Opening CL)
3. Click "Create Attendance Sheet"
4. Start marking attendance

### Option 2: Import File
1. Download sample template (Excel or CSV)
2. Fill in your employee data
3. Upload the file
4. Data automatically loaded

### Sample Template Format
```csv
Month,Employee ID,Name,Gross Salary,Opening CL,Day1,Day2,...,Day31
January 2026,EMP001,John Doe,25000,8,P,P,A,...
```

## Attendance Codes

- **P** - Present
- **A** - Absent
- **CL** - Casual Leave
- **HCL** - Half Day CL
- **HP** - Half Present
- **HL** - Half Leave
- **WO** - Week Off
- **WW** - Week Week
- **PH** - Public Holiday
- **pH** - Paid Holiday
- **PHW** - Paid Holiday Week
- **OD** - On Duty
- **WFH** - Work From Home

## Salary Calculation

### Earnings
- **Basic**: 50% of Earned Gross
- **DA**: 25% of Earned Gross
- **HRA**: 25% of Earned Gross
- **Bonus**: Configurable per employee
- **Other Allowances**: Configurable per employee
- **OT (Overtime)**: Configurable per employee

### Deductions
- **EPF**: 12% of min(Basic+DA, ₹15,000) - Only if Gross > ₹21,000
- **ESI**: 0.75% of Earned Gross - Only if Gross ≤ ₹21,000
- **Professional Tax**: ₹200 - Only if Earned Gross > ₹21,000
- **Other Deductions**: Configurable per employee

### Formula
```
Earned Gross = (Gross × Payable Days) ÷ 31
Payable Days = Present + PH + WO + OD + CL
Net Salary = Total Earnings - Total Deductions
```

## 📚 Documentation

- **[Data Setup Guide](./DATA_SETUP_GUIDE.md)** - How to set up your data
- **[App Review Resolution](./APP_REVIEW_RESOLUTION.md)** - Detailed fix summary
- **[Quick Fix Guide](./QUICK_FIX_GUIDE.md)** - How to use features
- **[Real-Time Sync Guide](./REALTIME_SYNC_GUIDE.md)** - Data synchronization

## ⚠️ Known Limitations

- Table is 3500px wide (by design for 31 days + salary columns)
- No undo/redo functionality (future enhancement)
- LocalStorage limit: 5-10MB (export data regularly)
- Single month at a time (multi-month coming soon)

## 🚀 Production Ready

✅ Internal company use  
✅ Small to medium teams (up to 100 employees)  
✅ Monthly attendance tracking  
✅ Complete salary calculations  
✅ Flexible data input (manual/import)  
✅ Excel/CSV import/export  
⚠️ Needs authentication for external use  
⚠️ Needs virtual scrolling for 100+ employees
