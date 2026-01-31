import { client } from '../lib/appwrite';
import { Storage, ID } from 'appwrite';

const storage = new Storage(client);
const BUCKET_ID = 'employee-files';

export class StorageService {
  static async uploadFile(file, folder = 'documents') {
    try {
      const fileId = `${folder}_${Date.now()}_${ID.unique()}`;
      const response = await storage.createFile(BUCKET_ID, fileId, file);
      return {
        success: true,
        fileId: response.$id,
        url: this.getFileUrl(response.$id)
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return { success: false, error: error.message };
    }
  }

  static getFileUrl(fileId) {
    return storage.getFileView(BUCKET_ID, fileId);
  }

  static async deleteFile(fileId) {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async listFiles() {
    try {
      const response = await storage.listFiles(BUCKET_ID);
      return response.files;
    } catch (error) {
      console.error('List files failed:', error);
      return [];
    }
  }
}
