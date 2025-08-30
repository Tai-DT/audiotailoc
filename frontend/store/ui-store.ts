import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface UIState {
  notifications: Notification[];
  isLoading: boolean;
  theme: 'light' | 'dark';
}

interface UIActions {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const initialState: UIState = {
  notifications: [],
  isLoading: false,
  theme: 'light',
};

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  ...initialState,

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    set({ notifications: [...get().notifications, newNotification] });

    // Auto remove after duration
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration);
    }
  },

  removeNotification: (id) => {
    set({ notifications: get().notifications.filter(n => n.id !== id) });
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setTheme: (theme) => {
    set({ theme });
  },
}));