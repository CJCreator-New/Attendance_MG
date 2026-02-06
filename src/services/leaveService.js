import { AppwriteService, COLLECTIONS, Query } from './appwriteService';
import { ID } from 'appwrite';
import { sanitizeId, sanitizeEnum, sanitizeDate } from '../utils/querySanitization';

// Create leave collection in Appwrite first
const LEAVE_COLLECTION = 'leaves';

export class LeaveService {
  static async createLeave(leaveData) {
    const data = {
      employeeId: leaveData.employeeId,
      employeeName: leaveData.employeeName,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days: leaveData.days,
      reason: leaveData.reason || '',
      status: leaveData.status || 'pending',
      appliedDate: leaveData.appliedDate || new Date().toISOString(),
      approvedBy: leaveData.approvedBy || '',
      approvedDate: leaveData.approvedDate || '',
      remarks: leaveData.remarks || ''
    };
    return await AppwriteService.createDocument(LEAVE_COLLECTION, data);
  }

  static async getLeave(documentId) {
    return await AppwriteService.getDocument(LEAVE_COLLECTION, documentId);
  }

  static async getAllLeaves(queries = []) {
    try {
      const response = await AppwriteService.listDocuments(LEAVE_COLLECTION, [
        Query.orderDesc('appliedDate'),
        ...queries
      ]);
      return response.documents;
    } catch (error) {
      // If collection doesn't exist, return empty array instead of crashing
      if (error.message?.includes('Collection with the requested ID')) {
        console.warn('Leaves collection not found. Returning empty array.');
        return [];
      }
      throw error;
    }
  }

  static async getLeavesByEmployee(employeeId) {
    const sanitizedEmpId = sanitizeId(employeeId);
    
    const response = await AppwriteService.listDocuments(LEAVE_COLLECTION, [
      Query.equal('employeeId', sanitizedEmpId),
      Query.orderDesc('appliedDate')
    ]);
    return response.documents;
  }

  static async getPendingLeaves() {
    const response = await AppwriteService.listDocuments(LEAVE_COLLECTION, [
      Query.equal('status', 'pending'),
      Query.orderAsc('appliedDate')
    ]);
    return response.documents;
  }

  static async getLeavesByStatus(status) {
    const sanitizedStatus = sanitizeEnum(status, ['pending', 'approved', 'rejected']);
    
    const response = await AppwriteService.listDocuments(LEAVE_COLLECTION, [
      Query.equal('status', sanitizedStatus),
      Query.orderDesc('appliedDate')
    ]);
    return response.documents;
  }

  static async getLeavesByDateRange(startDate, endDate) {
    const sanitizedStart = sanitizeDate(startDate);
    const sanitizedEnd = sanitizeDate(endDate);
    
    const response = await AppwriteService.listDocuments(LEAVE_COLLECTION, [
      Query.greaterThanEqual('startDate', sanitizedStart),
      Query.lessThanEqual('endDate', sanitizedEnd)
    ]);
    return response.documents;
  }

  static async updateLeave(documentId, leaveData) {
    return await AppwriteService.updateDocument(LEAVE_COLLECTION, documentId, leaveData);
  }

  static async approveLeave(documentId, approvedBy) {
    return await AppwriteService.updateDocument(LEAVE_COLLECTION, documentId, {
      status: 'approved',
      approvedBy,
      approvedDate: new Date().toISOString()
    });
  }

  static async rejectLeave(documentId, approvedBy, remarks) {
    return await AppwriteService.updateDocument(LEAVE_COLLECTION, documentId, {
      status: 'rejected',
      approvedBy,
      approvedDate: new Date().toISOString(),
      remarks
    });
  }

  static async deleteLeave(documentId) {
    return await AppwriteService.deleteDocument(LEAVE_COLLECTION, documentId);
  }

  static async getLeaveBalance(employeeId, year) {
    const leaves = await this.getLeavesByEmployee(employeeId);
    const approved = leaves.filter(l => 
      l.status === 'approved' && 
      new Date(l.startDate).getFullYear() === year
    );
    
    const totalDays = approved.reduce((sum, l) => sum + (l.days || 0), 0);
    return {
      taken: totalDays,
      pending: leaves.filter(l => l.status === 'pending').length,
      approved: approved.length,
      rejected: leaves.filter(l => l.status === 'rejected').length
    };
  }
}
