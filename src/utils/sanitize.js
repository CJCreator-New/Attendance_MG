const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

export const sanitize = {
  string: sanitizeString,
  object: sanitizeObject,
  email: (email) => {
    const sanitized = sanitizeString(email);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized) ? sanitized : '';
  },
  phone: (phone) => {
    return String(phone).replace(/[^\d+\-() ]/g, '');
  },
  number: (num) => {
    const parsed = parseFloat(num);
    return isNaN(parsed) ? 0 : parsed;
  }
};
