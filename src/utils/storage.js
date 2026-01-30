import { STORAGE_KEYS } from '../constants/storageKeys';
import { STORAGE_CONSTANTS } from '../constants';
import { UI_CONSTANTS } from '../constants/uiConstants';

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
    const compressed = compressData(data);
    const size = compressed.length;
    
    // Check BEFORE writing
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

export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_DATA);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Validate data structure
    if (!parsed || typeof parsed !== 'object') {
      console.error('Invalid data structure');
      return null;
    }
    
    if (!Array.isArray(parsed.employees)) {
      console.error('Invalid employees array');
      return null;
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
