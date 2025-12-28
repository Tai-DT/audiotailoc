/**
 * WebSocket utility for real-time communication
 * Handles connection, reconnection, and event management
 */

import { Socket, Manager } from 'socket.io-client';

interface SocketConfig {
  url?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
}

type EventCallback = (...args: unknown[]) => void;

class SocketManager {
  private socket: Socket | null = null;
  private url: string;
  private config: SocketConfig;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private isConnecting = false;

  constructor(config: SocketConfig = {}) {
    // Base URL from config or env. If not provided, derive from current origin.
    // For localhost use default backend ws port 3010. For production, use same host with wss when page served over https.
    if (config.url) {
      this.url = config.url;
    } else if (process.env.NEXT_PUBLIC_WS_URL && process.env.NEXT_PUBLIC_WS_URL.trim().length > 0) {
      this.url = process.env.NEXT_PUBLIC_WS_URL;
    } else if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const hostname = window.location.hostname;
      const port = window.location.port;

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        this.url = `${protocol}://${hostname}:3010`;
      } else if (port && port.trim().length > 0) {
        this.url = `${protocol}://${hostname}:${port}`;
      } else {
        this.url = `${protocol}://${hostname}`;
      }
    } else {
      this.url = 'ws://localhost:3010';
    }
    this.config = {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      ...config,
    };
  }

  async connect(token?: string): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      // Get token if not provided
      const authToken = token || await this.getAuthToken();

      // Create socket connection using Manager
      const manager = new Manager(this.url, {
        transports: ['polling', 'websocket'], // Start with polling for better compatibility
        reconnection: this.config.reconnection,
        reconnectionDelay: this.config.reconnectionDelay,
        reconnectionAttempts: 10, // Increase attempts
        path: '/socket.io',
        withCredentials: true,
        extraHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      });

      // Connect to the common realtime namespace if not root
      const namespace = this.url.includes('/api/v1') ? '/api/v1/realtime' : '/';
      this.socket = manager.socket(namespace);

      // Set up event handlers
      this.setupEventHandlers();

      // Wait for connection
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Connection timeout to ${this.url} (${namespace})`));
        }, 15000);

        this.socket!.once('connect', () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          console.log(`WebSocket connected to ${namespace}`);
          resolve();
        });

        this.socket!.once('connect_error', (error) => {
          clearTimeout(timeout);
          this.isConnecting = false;
          console.error(`WebSocket connection error to ${this.url} (${namespace}):`, error.message);
          reject(error);
        });
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.emit('socket:connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emit('socket:disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('socket:error', error);
    });

    // Reconnection events
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.emit('socket:reconnected', attemptNumber);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket reconnection attempt', attemptNumber);
      this.emit('socket:reconnecting', attemptNumber);
    });

    // Notification events
    this.socket.on('notification:new', (data) => {
      this.emit('notification:new', data);
    });

    this.socket.on('notification:update', (data) => {
      this.emit('notification:update', data);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('socket:error', error);
    });
  }

  private async getAuthToken(): Promise<string | null> {
    // Try to get token from multiple sources
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (localToken) return localToken;

    const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    if (sessionToken) return sessionToken;

    try {
      const session = await fetch('/api/auth/session').then(res => res.json());
      if (session?.accessToken) return session.accessToken;
    } catch {
      // Session fetch failed
    }

    return null;
  }

  // Event emitter methods
  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Also register with socket if connected
    if (this.socket?.connected && !event.includes(':')) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }

    // Also unregister from socket
    if (this.socket && !event.includes(':')) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, ...args: unknown[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  // Socket.io methods wrapper
  send(event: string, data: unknown): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Message not sent:', event, data);
      return;
    }
    this.socket.emit(event, data);
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketManager = new SocketManager();

// Export class for custom instances
export { SocketManager };

// Export types
export type { Socket };
