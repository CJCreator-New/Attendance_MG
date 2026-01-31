import { databases } from '../lib/appwrite';
import { ID } from 'appwrite';

const DATABASE_ID = 'attendance-db';
const AUDIT_COLLECTION = 'audit-logs';

export class AuditService {
  static async log(action, resource, details = {}) {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      
      const auditData = {
        userId,
        action,
        resource,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString(),
        ipAddress: 'client',
        userAgent: navigator.userAgent
      };

      await databases.createDocument(DATABASE_ID, AUDIT_COLLECTION, ID.unique(), auditData);
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  }

  static async logCreate(resource, data) {
    await this.log('CREATE', resource, { data });
  }

  static async logUpdate(resource, id, changes) {
    await this.log('UPDATE', resource, { id, changes });
  }

  static async logDelete(resource, id) {
    await this.log('DELETE', resource, { id });
  }

  static async logLogin(userId) {
    await this.log('LOGIN', 'auth', { userId });
  }

  static async logLogout(userId) {
    await this.log('LOGOUT', 'auth', { userId });
  }

  static async getLogs(filters = {}) {
    const queries = [];
    if (filters.userId) queries.push(`userId=${filters.userId}`);
    if (filters.action) queries.push(`action=${filters.action}`);
    
    return await databases.listDocuments(DATABASE_ID, AUDIT_COLLECTION, queries);
  }
}
