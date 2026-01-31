# 🚀 Deployment Checklist

## Pre-Deployment Setup

### 1. Appwrite Collections Setup ⏳
**Status:** Ready to create

**Choose one method:**

#### Option A: Manual (Recommended - No CLI login needed)
- [ ] Follow `MANUAL_APPWRITE_SETUP.md`
- [ ] Create 4 new collections (tenants, branches, shifts, workflows)
- [ ] Create storage bucket (employee-files)
- [ ] Verify permissions set correctly
- **Time:** 15-20 minutes

#### Option B: CLI (Faster if already logged in)
- [ ] Run `appwrite login`
- [ ] Run `setup-appwrite-collections.bat` (Windows)
- [ ] Or run `bash setup-phase7-collections.sh` (Linux/Mac)
- **Time:** 5 minutes

### 2. Environment Variables ✅
Create `.env` file:
```env
VITE_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=697dac94002f85b009ab
VITE_APPWRITE_DATABASE_ID=attendance-db
```

### 3. Install Dependencies ✅
```bash
npm install
```

### 4. Build Application ⏳
```bash
npm run build
```

---

## Deployment Steps

### Step 1: Verify Local Setup
- [ ] All collections created in Appwrite
- [ ] Storage bucket created
- [ ] Environment variables configured
- [ ] Application builds successfully
- [ ] Application runs locally (`npm run dev`)

### Step 2: Test Core Features
- [ ] User registration/login works
- [ ] Employee CRUD operations work
- [ ] Attendance marking works
- [ ] Salary calculation works
- [ ] File upload works
- [ ] Real-time updates work

### Step 3: Test New Features (Phase 7)
- [ ] Tenant management works
- [ ] Branch management works
- [ ] Shift management works
- [ ] Workflow builder works

### Step 4: Deploy to Hosting

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

Set environment variables in Vercel dashboard.

#### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

Set environment variables in Netlify dashboard.

### Step 5: Post-Deployment Verification
- [ ] Application loads on production URL
- [ ] Login works
- [ ] All features functional
- [ ] No console errors
- [ ] Performance acceptable (< 3s load time)

---

## Collections Summary

### Existing Collections (Should already exist)
1. ✅ employees
2. ✅ attendance
3. ✅ salary-config
4. ✅ months
5. ✅ audit-logs

### New Collections (Need to create)
6. 🆕 tenants - Multi-tenancy support
7. 🆕 branches - Branch management
8. 🆕 shifts - Shift management
9. 🆕 workflows - Approval workflows

### Storage
- 🆕 employee-files bucket

---

## Quick Start Commands

### Setup Appwrite (Manual)
1. Go to https://cloud.appwrite.io/console
2. Select project: 697dac94002f85b009ab
3. Follow `MANUAL_APPWRITE_SETUP.md`

### Setup Appwrite (CLI)
```bash
appwrite login
setup-appwrite-collections.bat
```

### Build & Deploy
```bash
npm run build
vercel deploy --prod
```

---

## Troubleshooting

### Collections not showing
- Refresh Appwrite console
- Check database ID is correct
- Verify you're in the right project

### Permission errors
- Ensure permissions set to `users` for all operations
- Check user is authenticated

### Build fails
- Run `npm install` again
- Clear node_modules and reinstall
- Check Node.js version (18+)

### Features not working
- Verify environment variables
- Check Appwrite console for errors
- Review browser console logs

---

## Support Resources

- `MANUAL_APPWRITE_SETUP.md` - Step-by-step manual setup
- `APPWRITE_SETUP.md` - CLI setup guide
- `docs/DEPLOYMENT.md` - Detailed deployment guide
- `docs/DEVELOPER_GUIDE.md` - Development guide
- `docs/USER_GUIDE.md` - User manual

---

## Estimated Timeline

- **Appwrite Setup:** 15-20 minutes (manual) or 5 minutes (CLI)
- **Testing:** 10-15 minutes
- **Deployment:** 5-10 minutes
- **Total:** 30-45 minutes

---

## Next Steps After Deployment

1. ✅ Monitor application for errors
2. ✅ Gather user feedback
3. ✅ Expand test coverage
4. ✅ Add more features as needed
5. ✅ Regular backups

---

**Status:** Ready to deploy! 🚀  
**Action Required:** Create Appwrite collections (15-20 min)
