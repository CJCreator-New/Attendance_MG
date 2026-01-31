import { databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = 'attendance-db';
const COLLECTION_ID = 'shifts';

export const ShiftService = {
  async create(data) {
    return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      branchId: data.branchId,
      overtimeRules: JSON.stringify(data.overtimeRules || {}),
      status: 'active',
      createdAt: new Date().toISOString()
    });
  },

  async getByBranch(branchId) {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('branchId', branchId),
      Query.equal('status', 'active')
    ]);
    return response.documents.map(doc => ({
      ...doc,
      overtimeRules: JSON.parse(doc.overtimeRules || '{}')
    }));
  },

  async update(id, data) {
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
      ...data,
      overtimeRules: data.overtimeRules ? JSON.stringify(data.overtimeRules) : undefined
    });
  },

  async delete(id) {
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, { status: 'inactive' });
  }
};
