import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { config } from '@/lib/config'

interface WebSocketState {
  isConnected: boolean
  socket: Socket | null
  error: string | null
}

interface UseWebSocketReturn extends WebSocketState {
  sendMessage: (event: string, data: any) => void
  disconnect: () => void
}

export function useWebSocket(): UseWebSocketReturn {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    socket: null,
    error: null,
  })

  const sendMessage = useCallback((event: string, data: any) => {
    if (state.socket && state.isConnected) {
      state.socket.emit(event, data)
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }, [state.socket, state.isConnected])

  const disconnect = useCallback(() => {
    if (state.socket) {
      state.socket.disconnect()
      setState({
        isConnected: false,
        socket: null,
        error: null,
      })
    }
  }, [state.socket])

  useEffect(() => {
    if (!config.features.enableRealtime) {
      console.log('Real-time updates disabled')
      return
    }

    try {
      console.log('Connecting to WebSocket:', config.api.wsUrl)

      const socket = io(config.api.wsUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      // Connection events
      socket.on('connect', () => {
        console.log('WebSocket connected:', socket.id)
        setState(prev => ({
          ...prev,
          isConnected: true,
          socket,
          error: null,
        }))
      })

      socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason)
        setState(prev => ({
          ...prev,
          isConnected: false,
        }))
      })

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error)
        setState(prev => ({
          ...prev,
          error: error.message,
        }))
      })

      socket.on('reconnect', (attemptNumber) => {
        console.log('WebSocket reconnected after', attemptNumber, 'attempts')
        setState(prev => ({
          ...prev,
          isConnected: true,
          error: null,
        }))
      })

      socket.on('reconnect_error', (error) => {
        console.error('WebSocket reconnection failed:', error)
        setState(prev => ({
          ...prev,
          error: 'Failed to reconnect',
        }))
      })

      // Business events
      socket.on('system-metrics', (data) => {
        console.log('Received system metrics:', data)
        // This can be used by components to update real-time data
      })

      socket.on('notification', (notification) => {
        console.log('Received notification:', notification)
        // Handle real-time notifications
      })

      socket.on('user-activity', (activity) => {
        console.log('User activity:', activity)
        // Handle real-time user activity
      })

      // Store socket instance
      setState(prev => ({
        ...prev,
        socket,
      }))

      // Cleanup function
      return () => {
        console.log('Cleaning up WebSocket connection')
        socket.disconnect()
      }
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to initialize WebSocket',
      }))
    }
  }, [])

  return {
    ...state,
    sendMessage,
    disconnect,
  }
}

// Hook for system metrics updates
export function useSystemMetricsUpdates(onMetricsUpdate?: (data: any) => void) {
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleMetricsUpdate = (data: any) => {
      console.log('System metrics update:', data)
      if (onMetricsUpdate) {
        onMetricsUpdate(data)
      }
    }

    socket.on('system-metrics', handleMetricsUpdate)

    return () => {
      socket.off('system-metrics', handleMetricsUpdate)
    }
  }, [socket, isConnected, onMetricsUpdate])

  return { isConnected }
}

// Hook for real-time notifications
export function useRealtimeNotifications(onNotification?: (notification: any) => void) {
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleNotification = (notification: any) => {
      console.log('Real-time notification:', notification)
      if (onNotification) {
        onNotification(notification)
      }
    }

    socket.on('notification', handleNotification)

    return () => {
      socket.off('notification', handleNotification)
    }
  }, [socket, isConnected, onNotification])

  return { isConnected }
}

// Hook for user activity monitoring
export function useUserActivityUpdates(onActivityUpdate?: (activity: any) => void) {
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleActivityUpdate = (activity: any) => {
      console.log('User activity update:', activity)
      if (onActivityUpdate) {
        onActivityUpdate(activity)
      }
    }

    socket.on('user-activity', handleActivityUpdate)

    return () => {
      socket.off('user-activity', handleActivityUpdate)
    }
  }, [socket, isConnected, onActivityUpdate])

  return { isConnected }
}
