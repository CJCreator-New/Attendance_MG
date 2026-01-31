# 🧪 Week 1 Testing Guide

## 📋 **PRE-TESTING CHECKLIST**

### **1. Setup Leaves Collection**
```bash
# Run this first!
bash add-leaves-collection.sh
```

**Expected Output:**
```
✅ Creating leaves collection...
✅ Creating attributes...
✅ Creating indexes...
✅ Leaves collection created successfully!
```

### **2. Verify Appwrite Console**
Go to: https://cloud.appwrite.io/console/project-697dac94002f85b009ab/databases/attendance-db

**Check:**
- [ ] Database `attendance-db` exists
- [ ] 6 Collections exist:
  - [ ] employees
  - [ ] attendance
  - [ ] salary-config
  - [ ] months
  - [ ] companies
  - [ ] leaves (new)

### **3. Start Development Server**
```bash
npm run dev
```

**Expected:**
- Server starts on http://localhost:5173
- No console errors
- App loads successfully

---

## 🧪 **TEST SUITE**

### **TEST 1: Authentication** ✅

#### **1.1 Signup Test**
**Steps:**
1. Go to http://localhost:5173
2. Click "Sign up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test1234
   - Confirm: test1234
4. Click "Sign Up"

**Expected:**
- [ ] Redirects to dashboard
- [ ] No errors in console
- [ ] User logged in

**Verify in Appwrite:**
- Go to Auth → Users
- [ ] New user exists

#### **1.2 Login Test**
**Steps:**
1. Logout
2. Go to login page
3. Enter credentials
4. Click "Sign In"

**Expected:**
- [ ] Logs in successfully
- [ ] Redirects to dashboard
- [ ] Session persists on refresh

---

### **TEST 2: Employee Management** ✅

#### **2.1 View Employees**
**Steps:**
1. Navigate to Employee Management
2. Wait for data to load

**Expected:**
- [ ] Loading spinner shows
- [ ] Employees list loads
- [ ] Count shows correctly
- [ ] No console errors

#### **2.2 Add Employee**
**Steps:**
1. Click "Add Employee" (if available)
2. Fill in details:
   - Employee ID: EMP001
   - Name: John Doe
   - Gross Salary: 25000
   - Department: IT
3. Save

**Expected:**
- [ ] Employee added
- [ ] Shows in list
- [ ] Success toast appears

**Verify in Appwrite:**
- Go to Databases → employees
- [ ] New employee document exists

#### **2.3 Import Employees**
**Steps:**
1. Download template
2. Fill with sample data (3-5 employees)
3. Click "Import Excel"
4. Select file

**Expected:**
- [ ] Import progress shows
- [ ] Success message appears
- [ ] Employees appear in list
- [ ] Count updates

**Verify in Appwrite:**
- [ ] All imported employees in database

#### **2.4 Export Employees**
**Steps:**
1. Click "Export"
2. Check downloaded file

**Expected:**
- [ ] Excel file downloads
- [ ] Contains all employees
- [ ] Data is correct

---

### **TEST 3: Salary Management** ✅

#### **3.1 View Salary Data**
**Steps:**
1. Navigate to Salary Management
2. Wait for data to load

**Expected:**
- [ ] Loading overlay shows
- [ ] Salary data loads
- [ ] Metrics cards show:
  - [ ] Total Gross
  - [ ] Total Earnings
  - [ ] Total Deductions
  - [ ] Net Payable
- [ ] All values are numbers (not NaN)

#### **3.2 Salary Breakdown**
**Steps:**
1. Click "Salary Breakdown" tab
2. View employee salaries

**Expected:**
- [ ] Shows all employees
- [ ] Salary calculations correct
- [ ] EPF/ESI calculated properly
- [ ] Net salary = Earnings - Deductions

#### **3.3 Salary Register**
**Steps:**
1. Click "Salary Register" tab
2. Select month/year
3. View register

**Expected:**
- [ ] Shows salary register
- [ ] All employees listed
- [ ] Calculations correct

---

### **TEST 4: Attendance Sheet** ✅

#### **4.1 View Attendance**
**Steps:**
1. Navigate to Attendance
2. Wait for data to load

**Expected:**
- [ ] Attendance sheet loads
- [ ] Shows all employees
- [ ] Calendar grid visible
- [ ] Can scroll horizontally

#### **4.2 Mark Attendance**
**Steps:**
1. Click on any cell
2. Select attendance code (P, A, CL, etc.)
3. Click "Save"

**Expected:**
- [ ] Cell updates
- [ ] Color changes
- [ ] Save successful
- [ ] Data persists on refresh

**Verify in Appwrite:**
- Go to Databases → attendance
- [ ] Attendance data updated

#### **4.3 Bulk Operations**
**Steps:**
1. Click on day header
2. Select "Bulk Update"
3. Choose attendance code
4. Apply

**Expected:**
- [ ] All employees updated for that day
- [ ] Success message
- [ ] Changes saved

---

### **TEST 5: Data Persistence** ✅

#### **5.1 Refresh Test**
**Steps:**
1. Add/edit some data
2. Refresh browser (F5)
3. Check data

**Expected:**
- [ ] All data persists
- [ ] No data loss
- [ ] Loads from Appwrite

#### **5.2 Cross-Browser Test**
**Steps:**
1. Login in Chrome
2. Add employee
3. Open in Firefox/Edge
4. Login with same account

**Expected:**
- [ ] Same data visible
- [ ] Cloud sync working
- [ ] No conflicts

#### **5.3 Multi-Device Test**
**Steps:**
1. Login on desktop
2. Add data
3. Login on mobile/tablet

**Expected:**
- [ ] Data syncs
- [ ] Mobile UI works
- [ ] All features accessible

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: "Cannot find module 'appwrite'"**
**Fix:**
```bash
npm install appwrite
```

### **Issue 2: "Appwrite connection failed"**
**Fix:**
1. Check internet connection
2. Verify project ID in `src/lib/appwrite.js`
3. Check Appwrite console is accessible

### **Issue 3: "No data loading"**
**Fix:**
1. Check browser console for errors
2. Verify collections exist in Appwrite
3. Check permissions are set correctly
4. Ensure user is authenticated

### **Issue 4: "Import failed"**
**Fix:**
1. Check Excel file format
2. Verify column names match
3. Check for duplicate employee IDs
4. See console for specific error

### **Issue 5: "Salary calculations wrong"**
**Fix:**
1. Check attendance data exists
2. Verify salary config exists
3. Check gross salary is set
4. Review salary calculator logic

---

## ✅ **TEST RESULTS CHECKLIST**

### **Authentication:**
- [ ] Signup works
- [ ] Login works
- [ ] Logout works
- [ ] Session persists

### **Employee Management:**
- [ ] View employees
- [ ] Add employee
- [ ] Edit employee
- [ ] Delete employee
- [ ] Import employees
- [ ] Export employees
- [ ] Search employees
- [ ] Filter employees

### **Salary Management:**
- [ ] View salary data
- [ ] Salary breakdown correct
- [ ] Salary register works
- [ ] Calculations accurate
- [ ] Metrics display correctly

### **Attendance:**
- [ ] View attendance sheet
- [ ] Mark attendance
- [ ] Bulk operations
- [ ] Save changes
- [ ] Data persists

### **Data Persistence:**
- [ ] Data saves to Appwrite
- [ ] Data loads from Appwrite
- [ ] Refresh doesn't lose data
- [ ] Cross-browser sync works

---

## 📊 **PERFORMANCE METRICS**

### **Load Times:**
- [ ] Initial load: < 3s
- [ ] Employee list: < 1s
- [ ] Salary data: < 2s
- [ ] Attendance sheet: < 2s

### **Operations:**
- [ ] Add employee: < 500ms
- [ ] Import 10 employees: < 3s
- [ ] Save attendance: < 500ms
- [ ] Calculate salaries: < 1s

---

## 🎯 **SUCCESS CRITERIA**

### **Must Pass:**
- [ ] All authentication tests pass
- [ ] Employee CRUD works
- [ ] Salary calculations correct
- [ ] Attendance saves properly
- [ ] Data persists in Appwrite
- [ ] No console errors
- [ ] No data loss

### **Should Pass:**
- [ ] Performance within targets
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Error messages clear
- [ ] Loading states show

### **Nice to Have:**
- [ ] Smooth animations
- [ ] Fast load times
- [ ] Intuitive UI
- [ ] Good UX

---

## 📝 **TEST REPORT TEMPLATE**

```
## Week 1 Test Report

**Date:** [Date]
**Tester:** [Your Name]
**Environment:** [Browser, OS]

### Test Results:
- Authentication: ✅/❌
- Employee Management: ✅/❌
- Salary Management: ✅/❌
- Attendance: ✅/❌
- Data Persistence: ✅/❌

### Issues Found:
1. [Issue description]
2. [Issue description]

### Performance:
- Initial load: [time]
- Employee list: [time]
- Salary data: [time]

### Overall Status: ✅ PASS / ❌ FAIL

### Notes:
[Any additional observations]
```

---

## 🚀 **AFTER TESTING**

### **If All Tests Pass:**
1. ✅ Mark Week 1 as complete
2. ✅ Document any issues
3. ✅ Proceed to Week 2
4. ✅ Celebrate! 🎉

### **If Tests Fail:**
1. ❌ Document failures
2. ❌ Fix critical issues
3. ❌ Re-test
4. ❌ Update code as needed

---

## 📞 **READY TO TEST?**

**Start with:**
1. Run leaves collection script
2. Start dev server
3. Follow test suite step-by-step
4. Document results

**Let me know when you're ready to start testing or if you encounter any issues!** 🧪
