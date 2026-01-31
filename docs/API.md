# API Documentation

## Services API Reference

### EmployeeService

#### getAllEmployees()
Fetches all employees from the database.

```javascript
const employees = await EmployeeService.getAllEmployees();
```

**Returns:** `Promise<Array<Employee>>`

#### createEmployee(data)
Creates a new employee record.

```javascript
const employee = await EmployeeService.createEmployee({
  empId: 'EMP001',
  name: 'John Doe',
  gross: 25000,
  openingCL: 8
});
```

**Parameters:**
- `data.empId` (string) - Employee ID
- `data.name` (string) - Employee name
- `data.gross` (number) - Gross salary
- `data.openingCL` (number) - Opening casual leave balance

**Returns:** `Promise<Employee>`

#### updateEmployee(id, data)
Updates an existing employee.

```javascript
await EmployeeService.updateEmployee('employee-id', { name: 'Jane Doe' });
```

#### deleteEmployee(id)
Deletes an employee.

```javascript
await EmployeeService.deleteEmployee('employee-id');
```

---

### AttendanceService

#### createAttendance(data)
Creates attendance record for an employee.

```javascript
await AttendanceService.createAttendance({
  employeeId: 'emp-id',
  monthId: 'month-id',
  attendance: ['P', 'P', 'A', ...],
  stats: { present: 28, absent: 3 }
});
```

#### getByMonth(monthId)
Fetches all attendance records for a month.

```javascript
const records = await AttendanceService.getByMonth('month-id');
```

---

### SalaryConfigService

#### createSalaryConfig(data)
Creates salary configuration for an employee.

```javascript
await SalaryConfigService.createSalaryConfig({
  employeeId: 'emp-id',
  bonus: 5000,
  allowances: 2000,
  deductions: 500
});
```

---

### LeaveService

#### applyLeave(data)
Submits a leave application.

```javascript
await LeaveService.applyLeave({
  employeeId: 'emp-id',
  type: 'CL',
  startDate: '2026-01-15',
  endDate: '2026-01-17',
  reason: 'Personal'
});
```

#### approveLeave(leaveId, approverId)
Approves a leave request.

```javascript
await LeaveService.approveLeave('leave-id', 'approver-id');
```

#### rejectLeave(leaveId, approverId, reason)
Rejects a leave request.

```javascript
await LeaveService.rejectLeave('leave-id', 'approver-id', 'Insufficient balance');
```

---

### StorageService

#### uploadFile(file, path)
Uploads a file to Appwrite Storage.

```javascript
const fileId = await StorageService.uploadFile(file, 'employees/emp-001/photo.jpg');
```

#### getFileUrl(fileId)
Gets the URL for a stored file.

```javascript
const url = StorageService.getFileUrl('file-id');
```

#### deleteFile(fileId)
Deletes a file from storage.

```javascript
await StorageService.deleteFile('file-id');
```

---

### NotificationService

#### success(message)
Shows success notification.

```javascript
NotificationService.success('Employee created successfully');
```

#### error(message)
Shows error notification.

```javascript
NotificationService.error('Failed to save data');
```

---

## Appwrite Collections

### employees
- `empId` (string) - Employee ID
- `name` (string) - Full name
- `gross` (number) - Gross salary
- `openingCL` (number) - Opening CL balance
- `department` (string) - Department
- `status` (string) - active/inactive

### attendance
- `employeeId` (string) - Reference to employee
- `monthId` (string) - Reference to month
- `attendance` (string) - JSON array of daily attendance
- `stats` (string) - JSON object with statistics

### salary-config
- `employeeId` (string) - Reference to employee
- `bonus` (number) - Bonus amount
- `allowances` (number) - Other allowances
- `deductions` (number) - Other deductions

### months
- `month` (string) - Month name
- `year` (number) - Year
- `dates` (string) - JSON array of dates
- `days` (string) - JSON array of day names
- `isActive` (boolean) - Active month flag

### audit-logs
- `userId` (string) - User who performed action
- `action` (string) - Action type
- `resource` (string) - Resource affected
- `details` (string) - JSON details
- `timestamp` (string) - ISO timestamp

---

## Error Handling

All services throw errors that should be caught:

```javascript
try {
  await EmployeeService.createEmployee(data);
} catch (error) {
  console.error('Failed:', error.message);
  toast.error(error.message);
}
```

---

## Rate Limits

- Create operations: 20 requests/minute
- Update operations: 30 requests/minute
- Delete operations: 10 requests/minute

---

## Security

All API calls require authentication. Use AuthContext:

```javascript
const { user } = useAuth();
if (!user) {
  // Redirect to login
}
```
