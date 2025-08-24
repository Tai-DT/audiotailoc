"use client"

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  autoConnect?: boolean;
  token?: string;
}

interface SocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = true, token } = options;
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<SocketState>({
    connected: false,
    connecting: false,
    error: null,
  });

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    // Do not connect if feature flag disabled
    if (process.env.NEXT_PUBLIC_ENABLE_REALTIME_CHAT !== 'true') return;

    setState(prev => ({ ...prev, connecting: true, error: null }));

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000', {
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    socket.on('connect', () => {
      setState({ connected: true, connecting: false, error: null });
    });

    socket.on('disconnect', (reason) => {
      setState({ connected: false, connecting: false, error: reason });
    });

    socket.on('connect_error', (error) => {
      setState({ connected: false, connecting: false, error: error.message });
    });

    socketRef.current = socket;
  }, [token]);

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({ connected: false, connecting: false, error: null });
    }
  };

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect]);

  return {
    socket: socketRef.current,
    ...state,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}

// Hook for order notifications
export function useOrderNotifications(userId?: string) {
  const { socket, connected, on, off } = useSocket({
    autoConnect: !!userId,
  });

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!connected || !socket) return;

    const handleOrderUpdate = (data: any) => {
      setNotifications(prev => [
        {
          id: `order_${Date.now()}`,
          type: 'order_update',
          title: 'Cập nhật đơn hàng',
          message: `Đơn hàng #${data.orderId.slice(-8)} đã chuyển sang trạng thái ${data.status}`,
          timestamp: data.timestamp,
          data,
        },
        ...prev.slice(0, 9) // Keep only 10 most recent
      ]);
    };

    const handleNotification = (data: any) => {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          type: 'notification',
          ...data,
        },
        ...prev.slice(0, 9)
      ]);
    };

    on('order:updated', handleOrderUpdate);
    on('notification', handleNotification);

    return () => {
      off('order:updated', handleOrderUpdate);
      off('notification', handleNotification);
    };
  }, [connected, socket, on, off]);

  const clearNotifications = () => setNotifications([]);
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    clearNotifications,
    removeNotification,
    connected,
  };
}

// Hook for chat functionality
export function useChat(userId?: string) {
  const { socket, connected, emit, on, off } = useSocket({
    autoConnect: !!userId,
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!connected || !socket) return;

    const handleMessage = (data: any) => {
      setMessages(prev => [...prev, data]);
    };

    const handleTyping = (data: any) => {
      setIsTyping(data.typing);
    };

    on('chat:message_received', handleMessage);
    on('chat:typing', handleTyping);

    return () => {
      off('chat:message_received', handleMessage);
      off('chat:typing', handleTyping);
    };
  }, [connected, socket, on, off]);

  const sendMessage = (message: string, sessionId?: string) => {
    if (connected && socket) {
      emit('chat:send_message', { message, sessionId });
    }
  };

  const startTyping = () => {
    if (connected && socket) {
      emit('chat:typing', { typing: true });
    }
  };

  const stopTyping = () => {
    if (connected && socket) {
      emit('chat:typing', { typing: false });
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    startTyping,
    stopTyping,
    connected,
  };
}
