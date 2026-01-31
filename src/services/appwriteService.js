import { client, databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { sanitize } from '../utils/sanitize';
import { rateLimiter } from '../utils/rateLimit';
import { AuditService } from './auditService';

export const DATABASE_ID = 'attendance-db';

export const COLLECTIONS = {
  EMPLOYEES: 'employees',
  ATTENDANCE: 'attendance',
  SALARY_CONFIG: 'salary-config',
  MONTHS: 'months',
  COMPANIES: 'companies'
};

export class AppwriteService {
  static async createDocument(collectionId, data, documentId = ID.unique()) {
    const result = rateLimiter.check(`create_${collectionId}`, 20, 60000);
    if (!result.allowed) {
      throw new Error(`Rate limit exceeded. Retry after ${Math.ceil(result.retryAfter / 1000)}s`);
    }

    try {
      const sanitizedData = sanitize.object(data);
      const doc = await databases.createDocument(
        DATABASE_ID,
        collectionId,
        documentId,
        sanitizedData
      );
      await AuditService.logCreate(collectionId, { id: doc.$id });
      return doc;
    } catch (error) {
      console.error(`Error creating document in ${collectionId}:`, error);
      throw error;
    }
  }

  static async getDocument(collectionId, documentId) {
    try {
      return await databases.getDocument(DATABASE_ID, collectionId, documentId);
    } catch (error) {
      console.error(`Error getting document from ${collectionId}:`, error);
      throw error;
    }
  }

  static async listDocuments(collectionId, queries = []) {
    try {
      return await databases.listDocuments(DATABASE_ID, collectionId, queries);
    } catch (error) {
      console.error(`Error listing documents from ${collectionId}:`, error);
      throw error;
    }
  }

  static async updateDocument(collectionId, documentId, data) {
    const result = rateLimiter.check(`update_${collectionId}`, 30, 60000);
    if (!result.allowed) {
      throw new Error(`Rate limit exceeded. Retry after ${Math.ceil(result.retryAfter / 1000)}s`);
    }

    try {
      const sanitizedData = sanitize.object(data);
      const doc = await databases.updateDocument(
        DATABASE_ID,
        collectionId,
        documentId,
        sanitizedData
      );
      await AuditService.logUpdate(collectionId, documentId, data);
      return doc;
    } catch (error) {
      console.error(`Error updating document in ${collectionId}:`, error);
      throw error;
    }
  }

  static async deleteDocument(collectionId, documentId) {
    const result = rateLimiter.check(`delete_${collectionId}`, 10, 60000);
    if (!result.allowed) {
      throw new Error(`Rate limit exceeded. Retry after ${Math.ceil(result.retryAfter / 1000)}s`);
    }

    try {
      const doc = await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
      await AuditService.logDelete(collectionId, documentId);
      return doc;
    } catch (error) {
      console.error(`Error deleting document from ${collectionId}:`, error);
      throw error;
    }
  }
}

export { Query };
