import { databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { sanitizeId } from '../utils/querySanitization';

const DATABASE_ID = 'attendance-db';
const COLLECTION_ID = 'tenants';

export const TenantService = {
  async create(data) {
    return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      name: data.name,
      domain: data.domain,
      status: 'active',
      settings: JSON.stringify(data.settings || {}),
      createdAt: new Date().toISOString()
    });
  },

  async getAll() {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('$createdAt')
    ]);
    return response.documents.map(doc => ({
      ...doc,
      settings: JSON.parse(doc.settings || '{}')
    }));
  },

  async update(id, data) {
    const sanitizedId = sanitizeId(id);
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, sanitizedId, {
      ...data,
      settings: data.settings ? JSON.stringify(data.settings) : undefined
    });
  },

  async delete(id) {
    const sanitizedId = sanitizeId(id);
    return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, sanitizedId);
  }
};
