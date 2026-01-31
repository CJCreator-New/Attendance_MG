# Manual Appwrite Setup Instructions

## ⚠️ CLI Requires Login

The Appwrite CLI requires authentication. Follow these steps:

## Option 1: CLI Setup (Recommended)

### Step 1: Login
```bash
appwrite login
```
This will open a browser window to authenticate.

### Step 2: Run Setup Script
```bash
# Windows
setup-appwrite-collections.bat

# Linux/Mac
bash setup-phase7-collections.sh
```

---

## Option 2: Manual Setup via Console (Easier)

### Step 1: Login to Appwrite Console
Go to: https://cloud.appwrite.io/console

### Step 2: Select Your Project
Project ID: `697dac94002f85b009ab`

### Step 3: Create Collections

#### Collection 1: tenants
1. Go to Databases → attendance-db → Create Collection
2. Collection ID: `tenants`
3. Name: `Tenants`
4. Add Attributes:
   - `name` (String, 255, Required)
   - `domain` (String, 255, Required)
   - `status` (String, 50, Required, Default: "active")
   - `settings` (String, 10000, Optional)
   - `createdAt` (String, 50, Required)
5. Set Permissions:
   - Read: `users`
   - Create: `users`
   - Update: `users`
   - Delete: `users`

#### Collection 2: branches
1. Create Collection
2. Collection ID: `branches`
3. Name: `Branches`
4. Add Attributes:
   - `name` (String, 255, Required)
   - `code` (String, 50, Required)
   - `location` (String, 500, Required)
   - `tenantId` (String, 50, Required)
   - `status` (String, 50, Required, Default: "active")
   - `createdAt` (String, 50, Required)
5. Set Permissions: Same as above

#### Collection 3: shifts
1. Create Collection
2. Collection ID: `shifts`
3. Name: `Shifts`
4. Add Attributes:
   - `name` (String, 255, Required)
   - `startTime` (String, 10, Required)
   - `endTime` (String, 10, Required)
   - `branchId` (String, 50, Required)
   - `overtimeRules` (String, 5000, Optional)
   - `status` (String, 50, Required, Default: "active")
   - `createdAt` (String, 50, Required)
5. Set Permissions: Same as above

#### Collection 4: workflows
1. Create Collection
2. Collection ID: `workflows`
3. Name: `Workflows`
4. Add Attributes:
   - `name` (String, 255, Required)
   - `type` (String, 50, Required)
   - `steps` (String, 10000, Required)
   - `status` (String, 50, Required, Default: "active")
   - `createdAt` (String, 50, Required)
5. Set Permissions: Same as above

### Step 4: Create Storage Bucket
1. Go to Storage → Create Bucket
2. Bucket ID: `employee-files`
3. Name: `Employee Files`
4. Set Permissions:
   - Read: `users`
   - Create: `users`
   - Update: `users`
   - Delete: `users`

---

## Verification

### Check Collections
You should have 9 collections total:
- ✅ employees (existing)
- ✅ attendance (existing)
- ✅ salary-config (existing)
- ✅ months (existing)
- ✅ audit-logs (existing)
- 🆕 tenants (new)
- 🆕 branches (new)
- 🆕 shifts (new)
- 🆕 workflows (new)

### Check Storage
You should have 1 bucket:
- 🆕 employee-files

---

## Quick Copy-Paste Attributes

### Tenants
```
name | String | 255 | Required
domain | String | 255 | Required
status | String | 50 | Required | Default: active
settings | String | 10000 | Optional
createdAt | String | 50 | Required
```

### Branches
```
name | String | 255 | Required
code | String | 50 | Required
location | String | 500 | Required
tenantId | String | 50 | Required
status | String | 50 | Required | Default: active
createdAt | String | 50 | Required
```

### Shifts
```
name | String | 255 | Required
startTime | String | 10 | Required
endTime | String | 10 | Required
branchId | String | 50 | Required
overtimeRules | String | 5000 | Optional
status | String | 50 | Required | Default: active
createdAt | String | 50 | Required
```

### Workflows
```
name | String | 255 | Required
type | String | 50 | Required
steps | String | 10000 | Required
status | String | 50 | Required | Default: active
createdAt | String | 50 | Required
```

---

## After Setup

1. ✅ Verify all collections created
2. ✅ Verify permissions set correctly
3. ✅ Verify storage bucket created
4. ✅ Test application features
5. ✅ Create sample data

---

## Estimated Time
- Manual setup: 15-20 minutes
- CLI setup: 5 minutes (after login)

Choose the method that works best for you!
