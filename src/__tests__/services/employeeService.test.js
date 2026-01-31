import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmployeeService } from '../../services/employeeService';
import { databases } from '../../lib/appwrite';

vi.mock('../../lib/appwrite');

describe('EmployeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get all employees', async () => {
    const mockEmployees = [
      { $id: '1', empId: 'EMP001', name: 'John Doe', gross: 25000 }
    ];
    databases.listDocuments.mockResolvedValue({ documents: mockEmployees });

    const result = await EmployeeService.getAllEmployees();
    expect(result).toEqual(mockEmployees);
    expect(databases.listDocuments).toHaveBeenCalled();
  });

  it('should create employee', async () => {
    const newEmployee = { empId: 'EMP002', name: 'Jane Doe', gross: 30000 };
    databases.createDocument.mockResolvedValue({ $id: '2', ...newEmployee });

    const result = await EmployeeService.createEmployee(newEmployee);
    expect(result.$id).toBe('2');
    expect(databases.createDocument).toHaveBeenCalled();
  });

  it('should update employee', async () => {
    const updates = { name: 'John Updated' };
    databases.updateDocument.mockResolvedValue({ $id: '1', ...updates });

    const result = await EmployeeService.updateEmployee('1', updates);
    expect(result.name).toBe('John Updated');
  });

  it('should delete employee', async () => {
    databases.deleteDocument.mockResolvedValue({});
    await EmployeeService.deleteEmployee('1');
    expect(databases.deleteDocument).toHaveBeenCalledWith(expect.any(String), expect.any(String), '1');
  });
});
