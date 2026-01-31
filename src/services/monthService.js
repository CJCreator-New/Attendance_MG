import { AppwriteService, COLLECTIONS, Query } from './appwriteService';
import { ID } from 'appwrite';

export class MonthService {
  static async createMonth(monthData) {
    const data = {
      month: monthData.month,
      year: monthData.year,
      dates: JSON.stringify(monthData.dates),
      days: JSON.stringify(monthData.days),
      isActive: monthData.isActive !== undefined ? monthData.isActive : true
    };
    return await AppwriteService.createDocument(COLLECTIONS.MONTHS, data);
  }

  static async getMonth(documentId) {
    const doc = await AppwriteService.getDocument(COLLECTIONS.MONTHS, documentId);
    return {
      ...doc,
      dates: JSON.parse(doc.dates),
      days: JSON.parse(doc.days)
    };
  }

  static async getActiveMonth() {
    const response = await AppwriteService.listDocuments(COLLECTIONS.MONTHS, [
      Query.equal('isActive', true)
    ]);
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      return {
        ...doc,
        dates: JSON.parse(doc.dates),
        days: JSON.parse(doc.days)
      };
    }
    return null;
  }

  static async updateMonth(documentId, monthData) {
    const data = { ...monthData };
    if (data.dates) data.dates = JSON.stringify(data.dates);
    if (data.days) data.days = JSON.stringify(data.days);
    return await AppwriteService.updateDocument(COLLECTIONS.MONTHS, documentId, data);
  }

  static async setActiveMonth(documentId) {
    const allMonths = await AppwriteService.listDocuments(COLLECTIONS.MONTHS);
    for (const month of allMonths.documents) {
      await AppwriteService.updateDocument(COLLECTIONS.MONTHS, month.$id, { isActive: false });
    }
    return await AppwriteService.updateDocument(COLLECTIONS.MONTHS, documentId, { isActive: true });
  }
}
