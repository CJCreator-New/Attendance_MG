import DOMPurify from 'dompurify';

// Input sanitization utilities

export const sanitizeInput = (input, options = {}) => {
  if (typeof input !== 'string') return input;
  
  const config = {
    ALLOWED_TAGS: options.allowedTags || [],
    ALLOWED_ATTR: options.allowedAttr || [],
    KEEP_CONTENT: true,
    ...options
  };
  
  return DOMPurify.sanitize(input.trim(), config);
};

export const sanitizeFormData = (formData) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  });
};

export const stripHTML = (html) => {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
};
