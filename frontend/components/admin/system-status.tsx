'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Server,
  Database,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Monitor,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useSystemHealth, useRedisHealth } from '@/lib/hooks/use-system-health';
import { toast } from 'react-hot-toast';

export function SystemStatus() {
  const {
    data: healthData,
    isLoading,
    error,
    refetch,
    dataUpdatedAt
  } = useSystemHealth({ refetchInterval: 30000 });

  const { data: redisData } = useRedisHealth();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('System status refreshed');
    } catch {
      toast.error('Failed to refresh system status');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'unhealthy' | 'degraded' | string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'degraded':
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'unhealthy':
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'unhealthy' | 'degraded' | string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return <Badge variant="default" className="bg-green-600">Healthy</Badge>;
      case 'degraded':
      case 'warning':
        return <Badge variant="outline" className="border-yellow-600 text-warning">Degraded</Badge>;
      case 'unhealthy':
      case 'error':
        return <Badge variant="destructive">Unhealthy</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatUptime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const formatResponseTime = (ms?: number): string => {
    if (!ms) return 'N/A';
    return `${ms}ms`;
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              <CardTitle>Trạng thái hệ thống</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error || !healthData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              <CardTitle>Trạng thái hệ thống</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mb-4" />
            <h3 className="font-semibold text-lg mb-2">Unable to Load System Status</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Failed to connect to health API'}
            </p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const lastUpdated = new Date(dataUpdatedAt);
  const systemMemory = healthData.systemInfo;
  const memoryPercentage = systemMemory
    ? ((systemMemory.totalMemory - systemMemory.freeMemory) / systemMemory.totalMemory) * 100
    : healthData.checks.memory.details?.percentage || 0;
  const cpuUsage = healthData.performance?.cpu.usage || 0;
  const diskUsage = healthData.checks.disk.details?.percentage || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            <CardTitle>Trạng thái hệ thống</CardTitle>
            {getStatusBadge(healthData.status)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* System Overview */}
          <div>
            <h4 className="font-medium mb-3">System Overview</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
                <p className="text-2xl font-bold">{formatUptime(healthData.uptime)}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="h-4 w-4 text-success" />
                  <p className="text-sm text-muted-foreground">Version</p>
                </div>
                <p className="text-2xl font-bold">{healthData.version}</p>
              </div>
            </div>
          </div>

          {/* Services Status */}
          <div>
            <h4 className="font-medium mb-3">Trạng thái dịch vụ</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">PostgreSQL Database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {formatResponseTime(healthData.checks.database.responseTime)}
                  </span>
                  {getStatusIcon(healthData.checks.database.status)}
                  {getStatusBadge(healthData.checks.database.status)}
                </div>
              </div>

              {redisData && (
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Server className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Redis Cache</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {formatResponseTime(redisData.responseTime)}
                    </span>
                    {getStatusIcon(redisData.status)}
                    {getStatusBadge(redisData.status)}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Dependencies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {formatResponseTime(healthData.checks.dependencies.responseTime)}
                  </span>
                  {getStatusIcon(healthData.checks.dependencies.status)}
                  {getStatusBadge(healthData.checks.dependencies.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Resource Usage with animated bars */}
          <div>
            <h4 className="font-medium mb-3">Sử dụng tài nguyên</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span>CPU Load</span>
                  </div>
                  <span className={`font-medium ${
                    cpuUsage > 80 ? 'text-destructive' :
                    cpuUsage > 60 ? 'text-warning' :
                    'text-success'
                  }`}>
                    {cpuUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      cpuUsage > 80 ? 'bg-destructive' :
                      cpuUsage > 60 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(cpuUsage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-success" />
                    <span>Memory Usage</span>
                  </div>
                  <span className={`font-medium ${
                    memoryPercentage > 80 ? 'text-destructive' :
                    memoryPercentage > 60 ? 'text-warning' :
                    'text-success'
                  }`}>
                    {memoryPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      memoryPercentage > 80 ? 'bg-destructive' :
                      memoryPercentage > 60 ? 'bg-yellow-500' :
                      'bg-success'
                    }`}
                    style={{ width: `${Math.min(memoryPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {diskUsage > 0 && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-warning" />
                      <span>Disk Usage</span>
                    </div>
                    <span className={`font-medium ${
                      diskUsage > 80 ? 'text-destructive' :
                      diskUsage > 60 ? 'text-warning' :
                      'text-success'
                    }`}>
                      {diskUsage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        diskUsage > 80 ? 'bg-destructive' :
                        diskUsage > 60 ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(diskUsage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Info */}
          {systemMemory && (
            <div>
              <h4 className="font-medium mb-3">Thông tin hệ thống</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform:</span>
                    <span className="font-medium">{systemMemory.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPU Cores:</span>
                    <span className="font-medium">{systemMemory.cpus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Memory:</span>
                    <span className="font-medium">{formatBytes(systemMemory.totalMemory)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Free Memory:</span>
                    <span className="font-medium">{formatBytes(systemMemory.freeMemory)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Node Version:</span>
                    <span className="font-medium">{systemMemory.nodeVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <span className="font-medium capitalize">{healthData.environment}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
