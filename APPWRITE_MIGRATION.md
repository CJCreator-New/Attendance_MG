# 🚀 Appwrite Migration Guide

## Overview
This guide helps you migrate from localStorage to Appwrite backend.

---

## 📋 Prerequisites

1. **Appwrite Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Project Created**: Project ID `697dac94002f85b009ab`
3. **Appwrite CLI**: Will be installed by setup script

---

## 🔧 Step 1: Setup Appwrite Backend

### Windows (PowerShell/CMD):
```bash
bash setup-appwrite.sh
```

### Linux/Mac:
```bash
chmod +x setup-appwrite.sh
./setup-appwrite.sh
```

**What this does:**
- Installs Appwrite CLI
- Creates database `attendance-db`
- Creates 5 collections (employees, attendance, salary-config, months, companies)
- Sets up all attributes and indexes
- Configures permissions

**Time:** ~5-10 minutes (includes attribute creation delays)

---

## 📦 Step 2: Migrate Existing Data

If you have data in localStorage, migrate it:

```bash
npm run migrate
```

**What this does:**
- Reads data from localStorage
- Creates month record in Appwrite
- Migrates all employees
- Creates attendance records
- Creates salary configurations

**Output:**
```
🚀 Starting migration from localStorage to Appwrite...
📊 Found 25 employees to migrate
📅 Creating month data...
✅ Month created: 67abc123...
👥 Migrating employees...
✅ Employee migrated: John Doe (EMP001)
  ✅ Attendance created for John Doe
  ✅ Salary config created for John Doe
...
✅ Migration completed successfully!
📊 Summary: 25/25 employees migrated
```

---

## ✅ Step 3: Verify Migration

1. **Check Appwrite Console:**
   - Go to [cloud.appwrite.io](https://cloud.appwrite.io)
   - Open your project
   - Navigate to Databases → attendance-db
   - Verify collections have data

2. **Test the App:**
```bash
npm run dev
```
   - Open http://localhost:5173
   - Check if employees load
   - Try editing attendance
   - Verify changes save

---

## 🔄 How It Works Now

### Before (localStorage):
```
Browser → localStorage → Browser
```

### After (Appwrite):
```
Browser → Appwrite Cloud → Database
```

### Key Changes:
- ✅ Data saved to cloud (accessible from anywhere)
- ✅ No 5MB localStorage limit
- ✅ Real-time sync capability
- ✅ Better data structure
- ✅ Built-in authentication ready

---

## 📁 File Structure

```
src/
├── lib/
│   └── appwrite.js              # Appwrite client config
├── services/
│   ├── appwriteService.js       # Base service
│   ├── employeeService.js       # Employee CRUD
│   ├── attendanceService.js     # Attendance CRUD
│   ├── authService.js           # Authentication
│   ├── monthService.js          # Month management
│   └── salaryConfigService.js   # Salary config
├── scripts/
│   └── migrateToAppwrite.js     # Migration script
└── utils/
    ├── storage.js               # Now uses Appwrite
    ├── storageAppwrite.js       # Appwrite storage
    └── storageLocal.js          # Old localStorage (backup)
```

---

## 🗄️ Database Schema

### Collections:

**1. employees**
- empId (string, unique)
- name (string)
- gross (float)
- openingCL (integer, default: 8)
- department (string)
- status (string, default: "active")
- sno (integer)

**2. attendance**
- employeeId (string)
- monthId (string)
- attendance (JSON array)
- presentDays, paidHoliday, weekOff, onDuty, casualLeave (integers)
- lossOfPay, payableDays (floats)

**3. salary-config**
- employeeId (string, unique)
- bonus, otherAllowance, ot, otherDeduction (floats)

**4. months**
- month (string)
- year (integer)
- dates (JSON array)
- days (JSON array)
- isActive (boolean)

**5. companies**
- name (string)
- address (string)
- settings (JSON)

---

## 🐛 Troubleshooting

### Issue: "Appwrite connection failed"
**Solution:**
- Check internet connection
- Verify project ID in `src/lib/appwrite.js`
- Check Appwrite console for project status

### Issue: "Migration failed: No data found"
**Solution:**
- Ensure you have data in localStorage first
- Check browser console for errors
- Try exporting to Excel first as backup

### Issue: "Attribute already exists"
**Solution:**
- Attributes were already created
- Skip to Step 2 (migration)
- Or delete database and re-run setup

### Issue: "Permission denied"
**Solution:**
- Check collection permissions in Appwrite console
- Ensure permissions include: `read("any")`, `create("users")`, `update("users")`, `delete("users")`

---

## 🔐 Authentication (Coming Soon)

Currently, permissions are set to `any` for testing.

**To enable auth:**
1. Update permissions to `users` only
2. Implement login/signup in UI
3. Use `AuthService` methods

---

## 📞 Support

**Issues?**
- Check Appwrite console logs
- Review browser console errors
- Verify all setup steps completed

**Need Help?**
- Appwrite Docs: [appwrite.io/docs](https://appwrite.io/docs)
- Discord: [appwrite.io/discord](https://appwrite.io/discord)
