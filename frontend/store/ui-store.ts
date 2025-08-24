import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UIState {
  notifications: Notification[];
  isLoading: boolean;
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalContent: React.ReactNode | null;
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
}

export interface UIActions {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'vi' | 'en') => void;
}

export type UIStore = UIState & UIActions;

const initialState: UIState = {
  notifications: [],
  isLoading: false,
  sidebarOpen: false,
  modalOpen: false,
  modalContent: null,
  theme: 'light',
  language: 'vi',
};

export const useUIStore = create<UIStore>((set, get) => ({
  ...initialState,

  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  openModal: (content) => {
    set({ modalOpen: true, modalContent: content });
  },

  closeModal: () => {
    set({ modalOpen: false, modalContent: null });
  },

  setTheme: (theme) => {
    set({ theme });
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  },

  setLanguage: (language) => {
    set({ language });
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  },
}));

// Initialize theme and language from localStorage
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  const savedLanguage = localStorage.getItem('language') as 'vi' | 'en';
  
  if (savedTheme) {
    useUIStore.getState().setTheme(savedTheme);
  }
  
  if (savedLanguage) {
    useUIStore.getState().setLanguage(savedLanguage);
  }
}
