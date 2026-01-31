// Async storage wrapper to prevent blocking UI
export const asyncLocalStorage = {
  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          localStorage.setItem(key, value);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  },

  getItem: (key) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localStorage.getItem(key));
      }, 0);
    });
  },

  removeItem: (key) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(key);
        resolve();
      }, 0);
    });
  }
};
