// Performance monitoring utilities

export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
};

export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = (fn, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Monitor component render times
export const withPerformanceMonitoring = (Component, componentName) => {
  return (props) => {
    const renderStart = performance.now();
    const result = Component(props);
    const renderEnd = performance.now();
    
    if (process.env.NODE_ENV === 'development' && renderEnd - renderStart > 16) {
      console.warn(`[Slow Render] ${componentName}: ${(renderEnd - renderStart).toFixed(2)}ms`);
    }
    
    return result;
  };
};
