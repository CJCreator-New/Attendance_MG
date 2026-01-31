// Client-side rate limiting

class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }

  reset(key) {
    this.requests.delete(key);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, times] of this.requests.entries()) {
      const recent = times.filter(time => now - time < this.windowMs);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }
}

export const rateLimiter = new RateLimiter(10, 60000);

export const withRateLimit = (fn, key = 'default') => {
  return (...args) => {
    if (!rateLimiter.isAllowed(key)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    return fn(...args);
  };
};

setInterval(() => rateLimiter.cleanup(), 60000);
