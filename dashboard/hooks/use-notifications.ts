"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import { apiClient } from '@/lib/api-client'
import { socketManager } from '@/lib/socket'
import { toast } from 'sonner'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  channels: string[]
  target: string
  createdAt: string
  readAt?: string
}

export interface NotificationSettings {
  emailEnabled: boolean
  smsEnabled: boolean
  pushEnabled: boolean
  soundEnabled: boolean
  desktopEnabled: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    soundEnabled: true,
    desktopEnabled: true
  })
  const [loading, setLoading] = useState(false)
  const connectedRef = useRef(false)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      
      // Get current user from localStorage or session
      const userId = localStorage.getItem('userId') || 'admin'
      
      // Fetch notifications from API
      const response = await apiClient.getNotifications({ 
        userId, 
        limit: 50 
      })
      
      // Transform API response to match Notification interface
      const apiNotifications = Array.isArray(response.data) ? response.data : []
      const transformedNotifications: Notification[] = apiNotifications.map((notif: unknown) => {
        const notificationData = notif as {
          id: string;
          title: string;
          message?: string;
          content?: string;
          type?: string;
          isRead?: boolean;
          channels?: string[];
          target?: string;
          createdAt: string;
          readAt?: string;
        };
        return {
          id: notificationData.id,
          title: notificationData.title,
          message: notificationData.message || notificationData.content || '',
          type: (notificationData.type as 'info' | 'success' | 'warning' | 'error') || 'info',
          isRead: notificationData.isRead || false,
          channels: notificationData.channels || ['app'],
          target: notificationData.target || 'all',
          createdAt: notificationData.createdAt,
          readAt: notificationData.readAt
        };
      })
      
      setNotifications(transformedNotifications)
    } catch (err) {
      // Silent error handling - API might not be available yet
      // Only show error if it's not a server error (500+)
      const error = err as { status?: number }
      if (error.status && error.status < 500) {
        toast.error('Không thể tải thông báo')
      }
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Send notification
  const sendNotification = useCallback(async (data: {
    title: string
    message: string
    type: string
    target: string
    channels: string[]
  }) => {
    try {
      setLoading(true)
      
      // Call backend API to create notification
      const response = await apiClient.createNotification(data)
      
      // Transform response to match Notification interface
      const notificationData = response.data as {
        id: string;
        title: string;
        message?: string;
        content?: string;
        type?: string;
        isRead?: boolean;
        channels?: string[];
        target?: string;
        createdAt: string;
      };
      
      const newNotification: Notification = {
        id: notificationData.id,
        title: notificationData.title,
        message: notificationData.message || notificationData.content || '',
        type: (notificationData.type as Notification['type']) || 'info',
        isRead: notificationData.isRead || false,
        channels: notificationData.channels || data.channels,
        target: notificationData.target || data.target,
        createdAt: notificationData.createdAt || new Date().toISOString()
      }
      
      setNotifications(prev => [newNotification, ...prev])
      toast.success('Thông báo đã được gửi')
    } catch {
      toast.error('Không thể gửi thông báo')
    } finally {
      setLoading(false)
    }
  }, [])

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const userId = localStorage.getItem('userId') || 'admin'
      await apiClient.markNotificationAsRead({
        notificationId,
        userId
      })
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId 
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      ))
    } catch {
      toast.error('Không thể đánh dấu đã đọc')
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId') || 'admin'
      await apiClient.markAllNotificationsAsRead(userId)
      
      const now = new Date().toISOString()
      setNotifications(prev => prev.map(n => ({
        ...n,
        isRead: true,
        readAt: n.readAt || now
      })))
      toast.success('Đã đánh dấu tất cả là đã đọc')
    } catch {
      toast.error('Không thể đánh dấu tất cả')
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      toast.success('Đã xóa thông báo')
    } catch {
      // Silent error handling
    }
  }, [])

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }))
      toast.success('Đã cập nhật cài đặt thông báo')
    } catch {
      toast.error('Không thể cập nhật cài đặt')
    }
  }, [])

  // WebSocket setup for real-time notifications
  useEffect(() => {
    const connectSocket = async () => {
      try {
        if (!connectedRef.current) {
          await socketManager.connect()
          connectedRef.current = true
        }

        // Handle new notification
        const handleNewNotification = (data: unknown) => {
          const notificationData = data as {
            id: string;
            title: string;
            message?: string;
            content?: string;
            type?: string;
            isRead?: boolean;
            channels?: string[];
            target?: string;
            createdAt: string;
            readAt?: string;
          };
          const newNotification: Notification = {
            id: notificationData.id,
            title: notificationData.title,
            message: notificationData.message || notificationData.content || '',
            type: (notificationData.type as 'info' | 'success' | 'warning' | 'error') || 'info',
            isRead: notificationData.isRead || false,
            channels: notificationData.channels || ['app'],
            target: notificationData.target || 'all',
            createdAt: notificationData.createdAt || new Date().toISOString(),
            readAt: notificationData.readAt
          }
          
          // Add to state
          setNotifications(prev => [newNotification, ...prev])
          
          // Show toast notification
          const toastOptions = {
            duration: 5000,
            action: {
              label: 'Xem',
              onClick: () => markAsRead(newNotification.id)
            }
          }
          
          switch (newNotification.type) {
            case 'success':
              toast.success(newNotification.title, {
                description: newNotification.message,
                ...toastOptions
              })
              break
            case 'error':
              toast.error(newNotification.title, {
                description: newNotification.message,
                ...toastOptions
              })
              break
            case 'warning':
              toast(newNotification.title, {
                description: newNotification.message,
                ...toastOptions
              })
              break
            default:
              toast(newNotification.title, {
                description: newNotification.message,
                ...toastOptions
              })
          }
          
          // Play sound if enabled
          if (settings.soundEnabled) {
            const audio = new Audio('/sounds/notification.mp3')
            audio.play().catch(() => {}) // Silent error - browser may block autoplay
          }
          
          // Show desktop notification if enabled and permission granted
          if (settings.desktopEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico'
            })
          }
        }

        // Handle notification update
        const handleNotificationUpdate = (data: unknown) => {
          const updateData = data as { id: string; [key: string]: unknown };
          setNotifications(prev => prev.map(n => 
            n.id === updateData.id ? { ...n, ...updateData } : n
          ))
        }

        socketManager.on('notification:new', handleNewNotification)
        socketManager.on('notification:update', handleNotificationUpdate)

        // Cleanup
        return () => {
          socketManager.off('notification:new', handleNewNotification)
          socketManager.off('notification:update', handleNotificationUpdate)
        }
      } catch {
        // Silent error - socket connection may not be available
        connectedRef.current = false
      }
    }

    connectSocket()
  }, [settings.soundEnabled, settings.desktopEnabled, markAsRead])

  // Request desktop notification permission
  useEffect(() => {
    if (settings.desktopEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [settings.desktopEnabled])

  return {
    notifications,
    settings,
    loading,
    fetchNotifications,
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings
  }
}
