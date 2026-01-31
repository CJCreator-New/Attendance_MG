import { account } from '../lib/appwrite';
import { ID } from 'appwrite';

export class AuthService {
  static async createAccount(email, password, name) {
    try {
      return await account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  }

  static async updatePassword(oldPassword, newPassword) {
    try {
      return await account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}
