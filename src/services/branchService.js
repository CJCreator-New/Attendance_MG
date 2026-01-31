import { databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { sanitizeId } from '../utils/querySanitization';

const DATABASE_ID = 'attendance-db';
const COLLECTION_ID = 'branches';

export const BranchService = {
  async create(data) {
    return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      name: data.name,
      code: data.code,
      location: data.location,
      tenantId: data.tenantId,
      status: 'active',
      createdAt: new Date().toISOString()
    });
  },

  async getByTenant(tenantId) {
    const sanitizedTenantId = sanitizeId(tenantId);
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('tenantId', sanitizedTenantId),
      Query.equal('status', 'active')
    ]);
    return response.documents;
  },

  async update(id, data) {
    const sanitizedId = sanitizeId(id);
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, sanitizedId, data);
  },

  async delete(id) {
    const sanitizedId = sanitizeId(id);
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, sanitizedId, { status: 'inactive' });
  }
};
