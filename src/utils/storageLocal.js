import { STORAGE_KEYS } from '../constants/storageKeys';
import { STORAGE_CONSTANTS } from '../constants';
import { UI_CONSTANTS } from '../constants/uiConstants';

const SCHEMA_VERSION = 2;

const validateDataStructure = (data) => {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid data structure' };
  if (!Array.isArray(data.employees)) return { valid: false, error: 'Invalid employees array' };
  
  for (const emp of data.employees) {
    if (!emp.empId || !emp.name) return { valid: false, error: `Invalid employee: ${emp.empId}` };
    if (typeof emp.gross !== 'number' || emp.gross < 0) return { valid: false, error: `Invalid salary for ${emp.empId}` };
    if (!Array.isArray(emp.attendance)) return { valid: false, error: `Invalid attendance for ${emp.empId}` };
  }
  
  return { valid: true };
};

const compressData = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    throw new Error('Failed to compress data');
  }
};

const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

export const saveToLocalStorage = (data) => {
  try {
    const dataWithVersion = { ...data, version: SCHEMA_VERSION };
    const compressed = compressData(dataWithVersion);
    const size = compressed.length;
    
    if (size > STORAGE_CONSTANTS.MAX_SIZE) {
      throw new Error('Data size exceeds 5MB limit. Please export to Excel and clear old data.');
    }
    
    const storageInfo = getStorageInfo();
    if (storageInfo.available < size) {
      throw new Error('Insufficient storage space. Please export your data and clear old records.');
    }
    
    if (storageInfo.percentage > UI_CONSTANTS.STORAGE_WARNING_THRESHOLD) {
      console.warn(`Storage usage at ${storageInfo.percentage.toFixed(1)}%. Consider exporting data.`);
    }
    
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_DATA, compressed);
    return { success: true, size };
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      return { 
        success: false, 
        error: 'Storage quota exceeded. Please export your data and clear old records.',
        code: 'QUOTA_EXCEEDED'
      };
    }
    console.error('Failed to save data:', error);
    return { success: false, error: error.message };
  }
};

const migrateData = (data, fromVersion, toVersion) => {
  let migrated = { ...data };
  
  if (fromVersion === 1 && toVersion >= 2) {
    if (migrated.employees) {
      migrated.employees = migrated.employees.map(emp => ({
        ...emp,
        openingCL: emp.openingCL || 8
      }));
    }
    migrated.version = 2;
  }
  
  return migrated;
};

export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_DATA);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    const version = parsed.version || 1;
    
    const validation = validateDataStructure(parsed);
    if (!validation.valid) {
      console.error('Data validation failed:', validation.error);
      return null;
    }
    
    if (version < SCHEMA_VERSION) {
      const migrated = migrateData(parsed, version, SCHEMA_VERSION);
      saveToLocalStorage(migrated);
      return migrated;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE_DATA);
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
};

export const getStorageInfo = () => {
  const size = getStorageSize();
  const maxSize = STORAGE_CONSTANTS.MAX_STORAGE_LIMIT;
  return {
    used: size,
    max: maxSize,
    percentage: (size / maxSize) * 100,
    available: maxSize - size
  };
};

export const saveToJSON = (data) => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `attendance_${data.month}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const createBackup = (data) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupKey = `${STORAGE_KEYS.ATTENDANCE_DATA}_backup_${timestamp}`;
  try {
    localStorage.setItem(backupKey, JSON.stringify(data));
    cleanOldBackups();
    return { success: true, key: backupKey };
  } catch (error) {
    console.error('Backup failed:', error);
    return { success: false, error: error.message };
  }
};

const cleanOldBackups = () => {
  const backups = [];
  for (let key in localStorage) {
    if (key.startsWith(`${STORAGE_KEYS.ATTENDANCE_DATA}_backup_`)) {
      backups.push({ key, timestamp: key.split('_backup_')[1] });
    }
  }
  backups.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  backups.slice(5).forEach(backup => localStorage.removeItem(backup.key));
};
