import { useState, useEffect, useMemo, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    totalCents?: number;
    createdAt: string;
    status?: string;
  }>;
}

interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel for better performance
      const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog/products?pageSize=1`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?pageSize=1`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?pageSize=1`),
      ]);

      // Process results
      const totalProducts = productsRes.status === 'fulfilled'
        ? (await productsRes.value.json()).totalCount || 0
        : 0;

      const totalOrders = ordersRes.status === 'fulfilled'
        ? (await ordersRes.value.json()).totalCount || 0
        : 0;

      const totalUsers = usersRes.status === 'fulfilled'
        ? (await usersRes.value.json()).totalCount || 0
        : 0;

      // Fetch recent orders for revenue calculation
      const recentOrdersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?pageSize=100`
      );

      let totalRevenue = 0;
      let recentOrders: any[] = [];

      if (recentOrdersRes.ok) {
        const ordersData = await recentOrdersRes.json();
        recentOrders = ordersData.items || [];
        totalRevenue = recentOrders.reduce((sum: number, order: any) =>
          sum + (order.totalCents || 0), 0
        );
      }

      setData({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        recentOrders: recentOrders.slice(0, 5),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// WebSocket service for real-time updates
class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Function[]> = new Map();

  connect(token?: string) {
    if (this.socket?.connected) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3010';

    this.socket = io(wsUrl, {
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Business events
    this.socket.on('dashboard.update', (data) => {
      this.emit('dashboard.update', data);
    });

    this.socket.on('order.created', (data) => {
      this.emit('order.created', data);
    });

    this.socket.on('order.updated', (data) => {
      this.emit('order.updated', data);
    });

    this.socket.on('product.created', (data) => {
      this.emit('product.created', data);
    });

    this.socket.on('user.registered', (data) => {
      this.emit('user.registered', data);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

      setTimeout(() => {
        this.connect();
      }, delay);
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  get isConnected() {
    return this.socket?.connected || false;
  }
}

// Global WebSocket instance
let websocketService: WebSocketService | null = null;

function getWebSocketService(): WebSocketService {
  if (!websocketService) {
    websocketService = new WebSocketService();
  }
  return websocketService;
}

// Hook for real-time dashboard updates
export function useRealtimeDashboard() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [, forceUpdate] = useState({});

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    const wsService = getWebSocketService();

    // Connect to WebSocket
    wsService.connect();

    // Listen for dashboard updates
    const handleDashboardUpdate = (data: any) => {
      setLastUpdate(new Date());
      triggerUpdate();
    };

    wsService.on('dashboard.update', handleDashboardUpdate);

    // Check connection status
    const checkConnection = () => {
      setIsConnected(wsService.isConnected);
    };

    const interval = setInterval(checkConnection, 1000);
    checkConnection();

    return () => {
      wsService.off('dashboard.update', handleDashboardUpdate);
      clearInterval(interval);
    };
  }, [triggerUpdate]);

  return { lastUpdate, isConnected, triggerUpdate };
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const wsService = getWebSocketService();

    const handleOrderCreated = (data: any) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'order',
        title: 'Đơn hàng mới',
        message: `Đơn hàng ${data.orderNo} vừa được tạo`,
        timestamp: new Date(),
        data
      }, ...prev]);
    };

    const handleOrderUpdated = (data: any) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'order_update',
        title: 'Cập nhật đơn hàng',
        message: `Đơn hàng ${data.orderNo} đã được cập nhật`,
        timestamp: new Date(),
        data
      }, ...prev]);
    };

    const handleUserRegistered = (data: any) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'user',
        title: 'Người dùng mới',
        message: `Người dùng ${data.email} vừa đăng ký`,
        timestamp: new Date(),
        data
      }, ...prev]);
    };

    wsService.on('order.created', handleOrderCreated);
    wsService.on('order.updated', handleOrderUpdated);
    wsService.on('user.registered', handleUserRegistered);

    return () => {
      wsService.off('order.created', handleOrderCreated);
      wsService.off('order.updated', handleOrderUpdated);
      wsService.off('user.registered', handleUserRegistered);
    };
  }, []);

  const clearNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    clearNotification,
    clearAllNotifications,
    unreadCount: notifications.length
  };
}

