import { useQuery } from '@tanstack/react-query';
import { authStorage } from '@/lib/auth-storage';

export interface SystemHealthData {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: HealthCheck;
    memory: HealthCheck;
    disk: HealthCheck;
    dependencies: HealthCheck;
  };
  performance?: {
    cpu: {
      usage: number;
      loadAverage: number[];
    };
    memory: {
      total: number;
      used: number;
      free: number;
      percentage: number;
    };
    disk: {
      total: number;
      used: number;
      free: number;
      percentage: number;
    };
  };
  systemInfo?: {
    platform: string;
    arch: string;
    nodeVersion: string;
    uptime: number;
    hostname: string;
    cpus: number;
    totalMemory: number;
    freeMemory: number;
    loadAverage: number[];
  };
  redis?: HealthCheck;
  upstash?: HealthCheck;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  details?: Record<string, unknown> | string | number | boolean | null;
  responseTime?: number;
}

const parseHealthResponse = async <T,>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data !== null && 'message' in data
      ? String((data as { message?: string }).message)
      : 'Health request failed';
    throw new Error(message);
  }

  return data as T;
};

const healthRequest = async <T,>(path: string): Promise<T> => {
  const token = authStorage.getAccessToken();
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`/api/health${path}`, {
    headers,
    credentials: 'same-origin',
    cache: 'no-store',
  });

  return parseHealthResponse<T>(response);
};

export function useSystemHealth(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      return healthRequest<SystemHealthData>('/detailed');
    },
    refetchInterval: options?.refetchInterval || 30000, // Refetch every 30 seconds
    retry: 2,
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}

export function useSystemPerformance() {
  return useQuery({
    queryKey: ['systemPerformance'],
    queryFn: async () => {
      return healthRequest('/performance');
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 1,
  });
}

export function useSystemInfo() {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: async () => {
      return healthRequest('/system');
    },
    staleTime: 300000, // System info doesn't change often, 5 minutes
  });
}

export function useMemoryUsage() {
  return useQuery({
    queryKey: ['memoryUsage'],
    queryFn: async () => {
      return healthRequest('/memory');
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

export function useRedisHealth() {
  return useQuery({
    queryKey: ['redisHealth'],
    queryFn: async () => {
      return healthRequest<HealthCheck>('/redis');
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 1,
  });
}

export function useDatabaseHealth() {
  return useQuery({
    queryKey: ['databaseHealth'],
    queryFn: async () => {
      return healthRequest<HealthCheck>('/database');
    },
    refetchInterval: 30000,
    retry: 2,
  });
}
