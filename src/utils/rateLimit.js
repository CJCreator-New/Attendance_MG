class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  check(key, limit = 10, windowMs = 60000) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= limit) {
      return { allowed: false, retryAfter: windowMs - (now - recentRequests[0]) };
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return { allowed: true };
  }

  reset(key) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

export const withRateLimit = (fn, limit = 10, windowMs = 60000) => {
  return async (...args) => {
    const key = `${fn.name}_${Date.now()}`;
    const result = rateLimiter.check(key, limit, windowMs);
    
    if (!result.allowed) {
      throw new Error(`Rate limit exceeded. Retry after ${Math.ceil(result.retryAfter / 1000)}s`);
    }
    
    return await fn(...args);
  };
};
