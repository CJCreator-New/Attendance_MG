# Login Guide

## Demo Credentials

### Manager Account (Full Access)
- **Email**: `manager@company.com`
- **Password**: `demo123`
- **Permissions**: All features enabled

### HR Account (Full Access)
- **Email**: `hr@company.com`
- **Password**: `demo123`
- **Permissions**: All features enabled

## Available Features

After logging in, you'll see these tabs in the navigation:

1. **Dashboard** - Overview and analytics
2. **Attendance** - Mark and manage attendance
3. **Leave Management** - Apply and approve leaves
4. **Salary** - Process payroll and generate payslips
5. **Employees** - Employee directory, analytics, bulk operations
6. **Reports** - Advanced reporting and exports
7. **Settings** - Company settings, salary structure, holidays, permissions

## First Time Setup

1. Login with either account
2. If you see the Welcome Screen, choose:
   - **Manual Entry** - Create attendance sheet from scratch
   - **Import File** - Upload Excel/CSV with employee data
3. Navigate to **Employees** tab to manage employee records
4. Navigate to **Settings** tab to configure:
   - Company information
   - Salary structure
   - Leave policies
   - Holiday calendar
   - Roles & permissions
   - Notifications
   - API integrations

## Troubleshooting

### Can't see Employees or Settings tabs?
- Make sure you're logged in with the correct account
- Both Manager and HR accounts now have full permissions
- Try logging out and logging back in

### Features not loading?
- Clear browser cache
- Check browser console for errors
- Ensure all dependencies are installed (`npm install`)

## Security Note

⚠️ **This is a demo authentication system**
- Passwords are stored in plain text
- No backend validation
- For production use, implement:
  - Secure backend authentication
  - Password hashing (bcrypt)
  - JWT tokens
  - Role-based access control (RBAC)
  - Session management
