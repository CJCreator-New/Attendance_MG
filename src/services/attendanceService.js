import { AppwriteService, COLLECTIONS, Query } from './appwriteService';
import { ID } from 'appwrite';
import { sanitizeId } from '../utils/querySanitization';

export class AttendanceService {
  static async createAttendance(attendanceData) {
    const data = {
      employeeId: attendanceData.employeeId,
      monthId: attendanceData.monthId,
      attendance: JSON.stringify(attendanceData.attendance),
      presentDays: attendanceData.presentDays || 0,
      paidHoliday: attendanceData.paidHoliday || 0,
      weekOff: attendanceData.weekOff || 0,
      onDuty: attendanceData.onDuty || 0,
      casualLeave: attendanceData.casualLeave || 0,
      lossOfPay: attendanceData.lossOfPay || 0,
      payableDays: attendanceData.payableDays || 0
    };
    return await AppwriteService.createDocument(COLLECTIONS.ATTENDANCE, data);
  }

  static async getAttendance(documentId) {
    const doc = await AppwriteService.getDocument(COLLECTIONS.ATTENDANCE, documentId);
    return {
      ...doc,
      attendance: JSON.parse(doc.attendance)
    };
  }

  static async getAttendanceByEmployeeAndMonth(employeeId, monthId) {
    const sanitizedEmpId = sanitizeId(employeeId);
    const sanitizedMonthId = sanitizeId(monthId);
    
    const response = await AppwriteService.listDocuments(COLLECTIONS.ATTENDANCE, [
      Query.equal('employeeId', sanitizedEmpId),
      Query.equal('monthId', sanitizedMonthId)
    ]);
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      return {
        ...doc,
        attendance: JSON.parse(doc.attendance)
      };
    }
    return null;
  }

  static async updateAttendance(documentId, attendanceData) {
    const data = { ...attendanceData };
    if (data.attendance) {
      data.attendance = JSON.stringify(data.attendance);
    }
    return await AppwriteService.updateDocument(COLLECTIONS.ATTENDANCE, documentId, data);
  }

  static async deleteAttendance(documentId) {
    return await AppwriteService.deleteDocument(COLLECTIONS.ATTENDANCE, documentId);
  }

  static async getAllAttendanceForMonth(monthId) {
    const sanitizedMonthId = sanitizeId(monthId);
    
    const response = await AppwriteService.listDocuments(COLLECTIONS.ATTENDANCE, [
      Query.equal('monthId', sanitizedMonthId)
    ]);
    return response.documents.map(doc => ({
      ...doc,
      attendance: JSON.parse(doc.attendance)
    }));
  }
}
