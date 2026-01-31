// Main storage interface - uses Appwrite by default
export { saveToAppwrite as saveToLocalStorage, loadFromAppwrite as loadFromLocalStorage } from './storageAppwrite';
export { clearLocalStorage, getStorageInfo, saveToJSON, createBackup } from './storageLocal';
