/**
 * Query Sanitization Utility
 * Prevents CWE-89 (SQL Injection) and CWE-90 (LDAP Injection)
 * 
 * Appwrite uses NoSQL (MariaDB) but still vulnerable to injection attacks
 * through Query.search() and user-provided filter values
 */

/**
 * Sanitize string for use in database queries
 * Removes special characters that could be used for injection
 */
export const sanitizeQueryValue = (value) => {
  if (value === null || value === undefined) return '';
  
  const str = String(value);
  
  // Remove SQL/NoSQL injection patterns
  return str
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
    .replace(/\$/g, '') // Remove MongoDB operators
    .replace(/\{|\}/g, '') // Remove JSON operators
    .replace(/\[|\]/g, '') // Remove array operators
    .replace(/<|>/g, '') // Remove comparison operators
    .replace(/\|/g, '') // Remove pipe operators
    .replace(/&/g, '') // Remove ampersand
    .replace(/\(/g, '') // Remove parentheses
    .replace(/\)/g, '')
    .trim();
};

/**
 * Sanitize search term for Query.search()
 * More permissive than query values but still safe
 */
export const sanitizeSearchTerm = (searchTerm) => {
  if (!searchTerm) return '';
  
  const str = String(searchTerm);
  
  // Allow alphanumeric, spaces, and basic punctuation
  return str
    .replace(/[^a-zA-Z0-9\s\-_.@]/g, '') // Only allow safe characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .substring(0, 100); // Limit length
};

/**
 * Sanitize email for queries
 */
export const sanitizeEmail = (email) => {
  if (!email) return '';
  
  const str = String(email).toLowerCase().trim();
  
  // Basic email validation and sanitization
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(str)) {
    throw new Error('Invalid email format');
  }
  
  return str;
};

/**
 * Sanitize ID for queries (alphanumeric only)
 */
export const sanitizeId = (id) => {
  if (!id) return '';
  
  const str = String(id);
  
  // Only allow alphanumeric and hyphens (Appwrite ID format)
  const sanitized = str.replace(/[^a-zA-Z0-9\-_]/g, '');
  
  if (sanitized.length === 0) {
    throw new Error('Invalid ID format');
  }
  
  return sanitized;
};

/**
 * Sanitize date for queries (ISO format only)
 */
export const sanitizeDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date format');
  }
  
  return dateObj.toISOString();
};

/**
 * Sanitize number for queries
 */
export const sanitizeNumber = (num) => {
  const parsed = Number(num);
  
  if (isNaN(parsed)) {
    throw new Error('Invalid number format');
  }
  
  return parsed;
};

/**
 * Sanitize enum value (must match allowed values)
 */
export const sanitizeEnum = (value, allowedValues) => {
  if (!allowedValues.includes(value)) {
    throw new Error(`Invalid value. Allowed: ${allowedValues.join(', ')}`);
  }
  
  return value;
};

/**
 * Validate and sanitize Query parameters
 */
export const sanitizeQueryParams = (params) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(params)) {
    // Skip null/undefined
    if (value === null || value === undefined) continue;
    
    // Sanitize based on type
    if (typeof value === 'string') {
      sanitized[key] = sanitizeQueryValue(value);
    } else if (typeof value === 'number') {
      sanitized[key] = sanitizeNumber(value);
    } else if (value instanceof Date) {
      sanitized[key] = sanitizeDate(value);
    } else {
      // For complex types, convert to string and sanitize
      sanitized[key] = sanitizeQueryValue(JSON.stringify(value));
    }
  }
  
  return sanitized;
};

/**
 * Whitelist-based field validator
 * Only allow queries on predefined fields
 */
export const validateQueryField = (field, allowedFields) => {
  if (!allowedFields.includes(field)) {
    throw new Error(`Query on field '${field}' not allowed`);
  }
  return field;
};

/**
 * Rate limit query operations to prevent abuse
 */
const queryRateLimits = new Map();

export const checkQueryRateLimit = (userId, maxQueries = 100, windowMs = 60000) => {
  const now = Date.now();
  const userLimit = queryRateLimits.get(userId) || { count: 0, resetAt: now + windowMs };
  
  if (now > userLimit.resetAt) {
    // Reset window
    queryRateLimits.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxQueries) {
    throw new Error('Query rate limit exceeded. Please try again later.');
  }
  
  userLimit.count++;
  queryRateLimits.set(userId, userLimit);
  return true;
};

/**
 * Allowed fields for each collection (whitelist)
 */
export const ALLOWED_QUERY_FIELDS = {
  employees: ['empId', 'name', 'department', 'status', 'email', 'phone', 'designation'],
  attendance: ['employeeId', 'monthId', 'presentDays', 'payableDays'],
  leaves: ['employeeId', 'status', 'leaveType', 'startDate', 'endDate'],
  'salary-config': ['employeeId'],
  months: ['month', 'year', 'isActive'],
  tenants: ['name', 'domain', 'status'],
  branches: ['name', 'code', 'tenantId', 'status'],
  shifts: ['name', 'branchId', 'status'],
  workflows: ['name', 'type', 'status']
};

/**
 * Safe query builder with automatic sanitization
 */
export const buildSafeQuery = (collection, field, operator, value) => {
  // Validate collection and field
  const allowedFields = ALLOWED_QUERY_FIELDS[collection];
  if (!allowedFields) {
    throw new Error(`Collection '${collection}' not configured for queries`);
  }
  
  validateQueryField(field, allowedFields);
  
  // Sanitize value based on type
  let sanitizedValue;
  if (typeof value === 'string') {
    sanitizedValue = sanitizeQueryValue(value);
  } else if (typeof value === 'number') {
    sanitizedValue = sanitizeNumber(value);
  } else if (value instanceof Date) {
    sanitizedValue = sanitizeDate(value);
  } else {
    throw new Error('Unsupported value type for query');
  }
  
  return { field, operator, value: sanitizedValue };
};
