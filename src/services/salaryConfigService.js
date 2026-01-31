import { AppwriteService, COLLECTIONS, Query } from './appwriteService';

export class SalaryConfigService {
  static async createSalaryConfig(configData) {
    const data = {
      employeeId: configData.employeeId,
      bonus: configData.bonus || 0,
      otherAllowance: configData.otherAllowance || 0,
      ot: configData.ot || 0,
      otherDeduction: configData.otherDeduction || 0
    };
    return await AppwriteService.createDocument(COLLECTIONS.SALARY_CONFIG, data);
  }

  static async getSalaryConfig(documentId) {
    return await AppwriteService.getDocument(COLLECTIONS.SALARY_CONFIG, documentId);
  }

  static async getSalaryConfigByEmployeeId(employeeId) {
    const response = await AppwriteService.listDocuments(COLLECTIONS.SALARY_CONFIG, [
      Query.equal('employeeId', employeeId)
    ]);
    return response.documents[0] || null;
  }

  static async updateSalaryConfig(documentId, configData) {
    return await AppwriteService.updateDocument(COLLECTIONS.SALARY_CONFIG, documentId, configData);
  }

  static async deleteSalaryConfig(documentId) {
    return await AppwriteService.deleteDocument(COLLECTIONS.SALARY_CONFIG, documentId);
  }

  static async getAllSalaryConfigs() {
    const response = await AppwriteService.listDocuments(COLLECTIONS.SALARY_CONFIG);
    return response.documents;
  }

  static async bulkUpdateSalaryConfigs(configs) {
    const results = [];
    for (const config of configs) {
      try {
        const existing = await this.getSalaryConfigByEmployeeId(config.employeeId);
        if (existing) {
          const result = await this.updateSalaryConfig(existing.$id, config);
          results.push({ success: true, data: result });
        } else {
          const result = await this.createSalaryConfig(config);
          results.push({ success: true, data: result });
        }
      } catch (error) {
        results.push({ success: false, error: error.message, employeeId: config.employeeId });
      }
    }
    return results;
  }
}
