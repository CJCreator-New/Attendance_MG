class SessionManager {
  constructor(timeoutMs = 30 * 60 * 1000) {
    this.timeoutMs = timeoutMs;
    this.timeoutId = null;
    this.onTimeout = null;
  }

  start(callback) {
    this.onTimeout = callback;
    this.reset();
    this.setupActivityListeners();
  }

  reset() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    this.timeoutId = setTimeout(() => {
      if (this.onTimeout) this.onTimeout();
    }, this.timeoutMs);
  }

  setupActivityListeners() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.reset(), true);
    });
  }

  stop() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

export const sessionManager = new SessionManager();
