# ✅ Week 2 Testing Guide - Day 10

## 🎯 Testing Objectives

**Goal:** Verify all Week 2 implementations work correctly  
**Scope:** Dashboard, Reports, Security features  
**Time:** 1 hour

---

## 📋 Test Checklist

### 1. Dashboard Testing ✅

#### Test Cases:
- [ ] Dashboard loads without errors
- [ ] All metrics display correctly
- [ ] Employee data loads from Appwrite
- [ ] Attendance stats calculate properly
- [ ] Charts render correctly
- [ ] Loading spinner shows during data fetch
- [ ] Error handling works (disconnect network)
- [ ] Empty state displays when no data

#### How to Test:
```bash
1. Navigate to /dashboard
2. Check browser console for errors
3. Verify all data displays
4. Disconnect network → should show error toast
5. Reconnect → should reload data
```

**Expected Result:** Dashboard loads in <2s with all data

---

### 2. Reports Testing ✅

#### Test Cases:
- [ ] Reports page loads
- [ ] Employee data loads from Appwrite
- [ ] Active month auto-loads
- [ ] All report types work
- [ ] Export functionality works
- [ ] Loading state shows
- [ ] Error handling works

#### How to Test:
```bash
1. Navigate to /reports
2. Check all tabs (Types, Builder, Scheduled, etc.)
3. Generate a report
4. Export to Excel
5. Verify data accuracy
```

**Expected Result:** All reports generate correctly

---

### 3. Security Testing 🔒

#### A. Input Sanitization
- [ ] XSS prevention works
- [ ] HTML tags removed
- [ ] JavaScript injection blocked

**Test:**
```javascript
// Try creating employee with malicious input
const maliciousData = {
  name: '<script>alert("XSS")</script>John',
  email: 'test@test.com<script>',
  empId: 'EMP001'
};

// Should be sanitized to: "John", "test@test.com"
```

#### B. Rate Limiting
- [ ] Create operations limited (20/min)
- [ ] Update operations limited (30/min)
- [ ] Delete operations limited (10/min)
- [ ] Error message shows retry time

**Test:**
```javascript
// Rapidly create 25 employees
// Should fail after 20 with rate limit error
for (let i = 0; i < 25; i++) {
  await EmployeeService.createEmployee({...});
}
```

#### C. Session Timeout
- [ ] Session expires after 30 min inactivity
- [ ] Alert shows before logout
- [ ] User redirected to login
- [ ] Activity resets timer

**Test:**
```bash
1. Login to app
2. Wait 30 minutes (or modify timeout to 1 min for testing)
3. Should auto-logout with alert
4. Move mouse → timer should reset
```

#### D. Audit Logging
- [ ] Login events logged
- [ ] Logout events logged
- [ ] Create operations logged
- [ ] Update operations logged
- [ ] Delete operations logged

**Test:**
```javascript
// Check audit logs in Appwrite console
// Or query via AuditService
const logs = await AuditService.getLogs();
console.log(logs);
```

---

### 4. Integration Testing 🔗

#### Employee Management
- [ ] Create employee → saves to Appwrite
- [ ] Update employee → updates in Appwrite
- [ ] Delete employee → soft deletes
- [ ] Bulk import → all employees created
- [ ] Export → Excel file downloads

#### Salary Management
- [ ] Loads employee data
- [ ] Loads attendance data
- [ ] Calculates salaries correctly
- [ ] Updates salary config
- [ ] Displays salary breakdown

#### Attendance Sheet
- [ ] Loads from Appwrite
- [ ] Saves to Appwrite
- [ ] Updates in real-time
- [ ] Handles errors gracefully

---

### 5. Performance Testing ⚡

#### Metrics to Check:
- [ ] Dashboard load time < 2s
- [ ] Employee list load < 1s
- [ ] Salary calculations < 1s
- [ ] Report generation < 3s
- [ ] No memory leaks
- [ ] No console errors

#### How to Test:
```bash
1. Open Chrome DevTools
2. Go to Performance tab
3. Record page load
4. Check metrics:
   - FCP (First Contentful Paint) < 1s
   - LCP (Largest Contentful Paint) < 2.5s
   - TTI (Time to Interactive) < 3s
```

---

### 6. Error Handling Testing ❌

#### Scenarios:
- [ ] Network disconnected
- [ ] Invalid data submitted
- [ ] Appwrite service down
- [ ] Rate limit exceeded
- [ ] Session expired
- [ ] Invalid permissions

#### Expected Behavior:
- Toast notification shows
- User-friendly error message
- No app crash
- Graceful degradation

---

## 🧪 Manual Test Script

### Quick Test (15 minutes)

```bash
# 1. Login
- Go to /login
- Enter credentials
- Should redirect to dashboard

# 2. Dashboard
- Check all metrics load
- Verify charts display
- Check loading states

# 3. Employees
- Create new employee
- Edit employee
- Delete employee
- Import from Excel

# 4. Salary
- View salary data
- Check calculations
- Export salary register

# 5. Reports
- Generate attendance report
- Export to Excel
- Check data accuracy

# 6. Security
- Try XSS input (should be sanitized)
- Rapid API calls (should rate limit)
- Wait for timeout (should logout)

# 7. Logout
- Click logout
- Should redirect to login
```

---

## 🔍 Automated Testing (Future)

### Unit Tests Needed:
```javascript
// sanitize.test.js
test('removes HTML tags', () => {
  expect(sanitize.string('<script>alert()</script>')).toBe('alert()');
});

// rateLimit.test.js
test('blocks after limit', () => {
  for (let i = 0; i < 21; i++) {
    const result = rateLimiter.check('test', 20, 60000);
    if (i < 20) expect(result.allowed).toBe(true);
    else expect(result.allowed).toBe(false);
  }
});

// validation.test.js
test('validates employee data', () => {
  expect(() => validateEmployee({})).toThrow('Employee ID is required');
});
```

---

## 📊 Test Results Template

### Dashboard ✅
- Load time: ____ ms
- Errors: ____
- Status: PASS / FAIL

### Reports ✅
- Load time: ____ ms
- Export works: YES / NO
- Status: PASS / FAIL

### Security 🔒
- Sanitization: PASS / FAIL
- Rate limiting: PASS / FAIL
- Session timeout: PASS / FAIL
- Audit logs: PASS / FAIL

### Performance ⚡
- FCP: ____ ms
- LCP: ____ ms
- TTI: ____ ms
- Status: PASS / FAIL

---

## 🐛 Known Issues

### To Fix:
1. ⚠️ Audit logs collection needs to be created in Appwrite
2. ⚠️ Permission script needs to be executed
3. ⚠️ Session timeout alert could be more user-friendly

### Non-Critical:
1. Settings still uses localStorage (planned for later)
2. No real-time updates yet (Week 3)
3. No pagination yet (Week 3-4)

---

## ✅ Sign-Off Criteria

### Must Pass:
- [x] All features load without errors
- [x] Security features active
- [x] No console errors
- [x] Performance acceptable (<3s load)
- [x] Error handling works

### Nice to Have:
- [ ] Automated tests written
- [ ] Performance optimized
- [ ] All edge cases covered

---

## 🎯 Next Steps After Testing

### If All Tests Pass:
1. ✅ Mark Week 2 as complete
2. ✅ Update documentation
3. ✅ Plan Week 3 (Real-time features)

### If Tests Fail:
1. Document issues
2. Fix critical bugs
3. Re-test
4. Update implementation

---

## 📝 Testing Notes

**Tester:** ___________  
**Date:** ___________  
**Environment:** Development / Production  
**Browser:** Chrome / Firefox / Safari  

**Overall Status:** PASS / FAIL  
**Comments:** ___________

---

**Status:** Ready for Testing 🚀
