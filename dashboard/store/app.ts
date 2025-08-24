import { create } from 'zustand'

interface AppState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export const useAppStore = create<AppState>((set, get) => ({
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setTheme: (theme) => set({ theme }),
  
  addNotification: (notification) => {
    const id = notification.id || Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))
    
    // Auto remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(id)
      }, notification.duration)
    }
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] })
}))
