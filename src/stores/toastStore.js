import { create } from 'zustand';
import DOMPurify from 'dompurify';

export const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    // Sanitize message to prevent XSS
    const sanitizedMessage = typeof message === 'string' ? DOMPurify.sanitize(message, { ALLOWED_TAGS: [] }) : String(message);
    set((state) => ({
      toasts: [...state.toasts, { id, message: sanitizedMessage, type, duration }]
    }));
    
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },
  
  success: (message, duration) => {
    useToastStore.getState().addToast(message, 'success', duration);
  },
  
  error: (message, duration) => {
    useToastStore.getState().addToast(message, 'error', duration);
  },
  
  warning: (message, duration) => {
    useToastStore.getState().addToast(message, 'warning', duration);
  },
  
  info: (message, duration) => {
    useToastStore.getState().addToast(message, 'info', duration);
  },
}));

export const toast = {
  success: (msg, duration) => useToastStore.getState().success(msg, duration),
  error: (msg, duration) => useToastStore.getState().error(msg, duration),
  warning: (msg, duration) => useToastStore.getState().warning(msg, duration),
  info: (msg, duration) => useToastStore.getState().info(msg, duration),
};
