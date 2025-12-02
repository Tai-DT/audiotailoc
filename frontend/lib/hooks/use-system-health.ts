import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

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
  details?: any;
  responseTime?: number;
}

export function useSystemHealth(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const response = await apiClient.get<SystemHealthData>('/health/detailed');
      return response.data;
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
      const response = await apiClient.get('/health/performance');
      return response.data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 1,
  });
}

export function useSystemInfo() {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: async () => {
      const response = await apiClient.get('/health/system');
      return response.data;
    },
    staleTime: 300000, // System info doesn't change often, 5 minutes
  });
}

export function useMemoryUsage() {
  return useQuery({
    queryKey: ['memoryUsage'],
    queryFn: async () => {
      const response = await apiClient.get('/health/memory');
      return response.data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

export function useRedisHealth() {
  return useQuery({
    queryKey: ['redisHealth'],
    queryFn: async () => {
      const response = await apiClient.get<HealthCheck>('/health/redis');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 1,
  });
}

export function useDatabaseHealth() {
  return useQuery({
    queryKey: ['databaseHealth'],
    queryFn: async () => {
      const response = await apiClient.get<HealthCheck>('/health/database');
      return response.data;
    },
    refetchInterval: 30000,
    retry: 2,
  });
}
