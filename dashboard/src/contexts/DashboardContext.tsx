'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: string
  read: boolean
}

export interface SystemMetrics {
  totalUsers: number
  totalProducts: number
  todayOrders: number
  todayRevenue: number
  activeConnections: number
  systemLoad: number
  memoryUsage: number
  responseTime: number
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error'
  uptime: number
  lastHealthCheck: string
  issues: string[]
  services: {
    database: 'up' | 'down' | 'degraded'
    redis: 'up' | 'down' | 'degraded'
    api: 'up' | 'down' | 'degraded'
    backup: 'up' | 'down' | 'degraded'
  }
}

export interface RecentActivity {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  type: 'create' | 'update' | 'delete' | 'login' | 'backup' | 'system'
}

interface DashboardContextType {
  metrics: SystemMetrics
  systemHealth: SystemHealth
  notifications: Notification[]
  recentActivity: RecentActivity[]
  isLoading: boolean
  error: string | null
  refreshData: () => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

interface DashboardProviderProps {
  children: ReactNode
}

// Mock data for development
const mockMetrics: SystemMetrics = {
  totalUsers: 15420,
  totalProducts: 1247,
  todayOrders: 156,
  todayRevenue: 2850000,
  activeConnections: 89,
  systemLoad: 45,
  memoryUsage: 62,
  responseTime: 145,
}

const mockSystemHealth: SystemHealth = {
  status: 'healthy',
  uptime: 86400 * 7, // 7 days
  lastHealthCheck: new Date().toISOString(),
  issues: [],
  services: {
    database: 'up',
    redis: 'up',
    api: 'up',
    backup: 'up',
  },
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Backup Completed',
    message: 'Daily backup completed successfully at 2:00 AM',
    type: 'success',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'High Memory Usage',
    message: 'Memory usage is above 80% threshold',
    type: 'warning',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: '3',
    title: 'New User Registration',
    message: '100 new users registered in the last hour',
    type: 'info',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    read: true,
  },
]

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    user: 'admin@audiotailoc.com',
    action: 'created',
    target: 'New product: Wireless Headphones Pro',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: 'create',
  },
  {
    id: '2',
    user: 'system',
    action: 'completed',
    target: 'Automated backup',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'backup',
  },
  {
    id: '3',
    user: 'manager@audiotailoc.com',
    action: 'updated',
    target: 'Product pricing for category Electronics',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'update',
  },
  {
    id: '4',
    user: 'admin@audiotailoc.com',
    action: 'processed',
    target: 'Order #12345 payment confirmation',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    type: 'update',
  },
  {
    id: '5',
    user: 'system',
    action: 'detected',
    target: 'Security scan completed successfully',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    type: 'system',
  },
]

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [metrics, setMetrics] = useState<SystemMetrics>(mockMetrics)
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(mockSystemHealth)
  const [recentActivity] = useState<RecentActivity[]>(mockRecentActivity)
  const [error, setError] = useState<string | null>(null)

  // Fetch metrics from API
  const { data: apiMetrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      try {
        return await apiClient.getSystemMetrics()
      } catch (error) {
        console.error('Error fetching metrics:', error)
        return mockMetrics // Fallback to mock data
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Fetch system health from API
  const { data: apiHealth, isLoading: healthLoading, error: healthError } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      try {
        return await apiClient.healthCheck()
      } catch (error) {
        console.error('Error fetching health:', error)
        return mockSystemHealth // Fallback to mock data
      }
    },
    refetchInterval: 60000, // Refetch every minute
  })

  // Update state when API data arrives
  useEffect(() => {
    if (apiMetrics) {
      setMetrics(apiMetrics.data || apiMetrics)
    }
  }, [apiMetrics])

  useEffect(() => {
    if (apiHealth) {
      setSystemHealth(apiHealth.data || apiHealth)
    }
  }, [apiHealth])

  // Handle API errors
  useEffect(() => {
    if (metricsError || healthError) {
      setError('Unable to fetch some dashboard data. Showing cached information.')
      // Add notification for API errors
      addNotification({
        title: 'API Connection Issue',
        message: 'Unable to fetch real-time data. Showing cached information.',
        type: 'warning',
      })
    } else {
      setError(null)
    }
  }, [metricsError, healthError])

  // Simulate real-time updates for development
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeConnections: Math.max(0, prev.activeConnections + (Math.random() > 0.5 ? 1 : -1)),
        systemLoad: Math.min(100, Math.max(0, prev.systemLoad + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.min(100, Math.max(0, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 20),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const refreshData = () => {
    // Trigger refetch for all queries
    // This would typically use queryClient.refetchQueries()
    console.log('Refreshing dashboard data...')
  }

  const isLoading = metricsLoading || healthLoading

  const value: DashboardContextType = {
    metrics,
    systemHealth,
    notifications,
    recentActivity,
    isLoading,
    error,
    refreshData,
    markNotificationAsRead,
    clearNotifications,
    addNotification,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
