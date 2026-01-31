import { databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = 'attendance-db';
const COLLECTION_ID = 'workflows';

export const WorkflowService = {
  async create(data) {
    return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      name: data.name,
      type: data.type, // 'leave', 'overtime', 'expense'
      steps: JSON.stringify(data.steps || []),
      status: 'active',
      createdAt: new Date().toISOString()
    });
  },

  async getByType(type) {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('type', type),
      Query.equal('status', 'active')
    ]);
    return response.documents.map(doc => ({
      ...doc,
      steps: JSON.parse(doc.steps || '[]')
    }));
  },

  async processApproval(workflowId, requestId, approverId, action) {
    // Get workflow
    const workflow = await databases.getDocument(DATABASE_ID, COLLECTION_ID, workflowId);
    const steps = JSON.parse(workflow.steps || '[]');
    
    // Find current step
    const currentStep = steps.find(s => s.approverId === approverId);
    if (!currentStep) throw new Error('Invalid approver');
    
    // Update step status
    currentStep.status = action; // 'approved' or 'rejected'
    currentStep.timestamp = new Date().toISOString();
    
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, workflowId, {
      steps: JSON.stringify(steps)
    });
  },

  async delete(id) {
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, { status: 'inactive' });
  }
};
