// Security utilities

// Password hashing (client-side - for demo only, use server-side in production)
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// HTTPS enforcement
export const enforceHTTPS = () => {
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};

// Authentication middleware pattern
export const requireAuth = (handler) => {
  return async (...args) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }
    return handler(...args);
  };
};

// API endpoint protection
export const protectedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  return response;
};

// CSRF token management
export const getCSRFToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.content;
};

export const withCSRF = (options = {}) => {
  const token = getCSRFToken();
  return {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': token
    }
  };
};

// Session management
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const initSessionTimeout = (onTimeout) => {
  let timeoutId;
  
  const resetTimeout = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(onTimeout, SESSION_TIMEOUT);
  };
  
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, resetTimeout);
  });
  
  resetTimeout();
  
  return () => {
    clearTimeout(timeoutId);
    events.forEach(event => {
      document.removeEventListener(event, resetTimeout);
    });
  };
};
