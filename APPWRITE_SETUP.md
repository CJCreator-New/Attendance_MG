# Quick Appwrite Setup Guide

## Prerequisites
- Appwrite CLI installed: `npm install -g appwrite-cli`
- Appwrite account with project created
- Project ID: `697dac94002f85b009ab`

## Step 1: Login to Appwrite
```bash
appwrite login
```

## Step 2: Set Project
```bash
appwrite client --endpoint https://sgp.cloud.appwrite.io/v1
appwrite client setProject 697dac94002f85b009ab
```

## Step 3: Create Database (if not exists)
```bash
appwrite databases create --databaseId attendance-db --name "Attendance DB"
```

## Step 4: Run Setup Script

### Windows
```bash
setup-appwrite-collections.bat
```

### Linux/Mac
```bash
bash setup-phase7-collections.sh
```

## Step 5: Create Storage Bucket
```bash
appwrite storage createBucket --bucketId employee-files --name "Employee Files" --permissions "read(\"users\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
```

## Step 6: Verify Setup

### Check Collections
```bash
appwrite databases listCollections --databaseId attendance-db
```

Expected collections:
- employees
- attendance
- salary-config
- months
- audit-logs
- tenants
- branches
- shifts
- workflows

### Check Storage
```bash
appwrite storage listBuckets
```

Expected bucket:
- employee-files

## Step 7: Test Application

1. Update `.env` file:
```env
VITE_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=697dac94002f85b009ab
VITE_APPWRITE_DATABASE_ID=attendance-db
```

2. Run application:
```bash
npm run dev
```

3. Test features:
- Login/Register
- Create employee
- Mark attendance
- Generate salary
- Upload documents
- Create tenant/branch/shift
- Create workflow

## Troubleshooting

### Error: Collection already exists
- Collections already created, skip to next step

### Error: Permission denied
- Check if logged in: `appwrite account get`
- Verify project ID is correct

### Error: Database not found
- Create database first (Step 3)

### Error: Invalid attribute
- Delete collection and recreate
- Or update attribute manually in console

## Manual Setup (Alternative)

If CLI fails, create collections manually in Appwrite Console:

### Tenants Collection
- name (string, 255, required)
- domain (string, 255, required)
- status (string, 50, required, default: "active")
- settings (string, 10000)
- createdAt (string, 50, required)

### Branches Collection
- name (string, 255, required)
- code (string, 50, required)
- location (string, 500, required)
- tenantId (string, 50, required)
- status (string, 50, required, default: "active")
- createdAt (string, 50, required)

### Shifts Collection
- name (string, 255, required)
- startTime (string, 10, required)
- endTime (string, 10, required)
- branchId (string, 50, required)
- overtimeRules (string, 5000)
- status (string, 50, required, default: "active")
- createdAt (string, 50, required)

### Workflows Collection
- name (string, 255, required)
- type (string, 50, required)
- steps (string, 10000, required)
- status (string, 50, required, default: "active")
- createdAt (string, 50, required)

### Permissions (All Collections)
- read("users")
- create("users")
- update("users")
- delete("users")

## Verification Checklist

- [ ] Appwrite CLI installed
- [ ] Logged into Appwrite
- [ ] Project ID configured
- [ ] Database created
- [ ] All 9 collections created
- [ ] Storage bucket created
- [ ] Permissions set correctly
- [ ] Environment variables configured
- [ ] Application runs successfully
- [ ] Can create/read/update/delete data

## Support

If you encounter issues:
1. Check Appwrite Console for errors
2. Review collection permissions
3. Verify environment variables
4. Check browser console for errors
5. Review `docs/DEPLOYMENT.md` for detailed guide
