import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => ({
    notifications: [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }, ...state.notifications]
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  
  deleteNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearAll: () => set({ notifications: [] })
}));

export class NotificationService {
  static notify(type, title, message) {
    useNotificationStore.getState().addNotification({ type, title, message });
  }

  static success(title, message) {
    this.notify('success', title, message);
  }

  static error(title, message) {
    this.notify('error', title, message);
  }

  static info(title, message) {
    this.notify('info', title, message);
  }

  static warning(title, message) {
    this.notify('warning', title, message);
  }
}

export { useNotificationStore };
