import { AppwriteService, COLLECTIONS, Query } from './appwriteService';
import { ID } from 'appwrite';
import { apiCache } from '../utils/cache';
import { sanitizeSearchTerm, sanitizeQueryValue, sanitizeId } from '../utils/querySanitization';

export class EmployeeService {
  static async createEmployee(employeeData) {
    const data = {
      empId: employeeData.empId,
      name: employeeData.name,
      gross: employeeData.gross,
      openingCL: employeeData.openingCL || 8,
      department: employeeData.department || '',
      status: employeeData.status || 'active',
      sno: employeeData.sno,
      designation: employeeData.designation || '',
      email: employeeData.email || '',
      phone: employeeData.phone || ''
    };
    apiCache.clear();
    return await AppwriteService.createDocument(COLLECTIONS.EMPLOYEES, data);
  }

  static async getEmployee(documentId) {
    return await AppwriteService.getDocument(COLLECTIONS.EMPLOYEES, documentId);
  }

  static async getAllEmployees(queries = []) {
    const cacheKey = `employees_${JSON.stringify(queries)}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await AppwriteService.listDocuments(COLLECTIONS.EMPLOYEES, [
      Query.equal('status', 'active'),
      Query.orderAsc('sno'),
      ...queries
    ]);
    
    apiCache.set(cacheKey, response.documents);
    return response.documents;
  }

  static async getEmployeesWithPagination(limit = 50, offset = 0, searchTerm = '') {
    const queries = [
      Query.equal('status', 'active'),
      Query.limit(Math.min(limit, 100)), // Max 100
      Query.offset(Math.max(offset, 0)),
      Query.orderAsc('sno')
    ];

    if (searchTerm) {
      const sanitized = sanitizeSearchTerm(searchTerm);
      if (sanitized) {
        queries.push(Query.search('name', sanitized));
      }
    }

    const response = await AppwriteService.listDocuments(COLLECTIONS.EMPLOYEES, queries);
    return {
      documents: response.documents,
      total: response.total
    };
  }

  static async updateEmployee(documentId, employeeData) {
    apiCache.clear();
    return await AppwriteService.updateDocument(COLLECTIONS.EMPLOYEES, documentId, employeeData);
  }

  static async deleteEmployee(documentId) {
    apiCache.clear();
    return await AppwriteService.updateDocument(COLLECTIONS.EMPLOYEES, documentId, { status: 'inactive' });
  }

  static async hardDeleteEmployee(documentId) {
    return await AppwriteService.deleteDocument(COLLECTIONS.EMPLOYEES, documentId);
  }

  static async getEmployeeByEmpId(empId) {
    const sanitizedEmpId = sanitizeQueryValue(empId);
    const response = await AppwriteService.listDocuments(COLLECTIONS.EMPLOYEES, [
      Query.equal('empId', sanitizedEmpId)
    ]);
    return response.documents[0] || null;
  }

  static async bulkCreateEmployees(employeesData) {
    const results = [];
    for (const emp of employeesData) {
      try {
        const result = await this.createEmployee(emp);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message, empId: emp.empId });
      }
    }
    return results;
  }

  static async getEmployeesByDepartment(department) {
    const sanitizedDept = sanitizeQueryValue(department);
    const response = await AppwriteService.listDocuments(COLLECTIONS.EMPLOYEES, [
      Query.equal('department', sanitizedDept),
      Query.equal('status', 'active')
    ]);
    return response.documents;
  }
}
