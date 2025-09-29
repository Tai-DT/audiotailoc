'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Zap
} from 'lucide-react';

export function SystemStatus() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Mock data - in real app, this would come from API
  const [systemStatus, setSystemStatus] = useState({
    database: { status: 'connected', responseTime: '2ms' },
    redis: { status: 'connected', responseTime: '1ms' },
    api: { status: 'connected', responseTime: '45ms' },
    disk: { usage: 45, total: '100GB' },
    memory: { usage: 68, total: '8GB' },
    cpu: { usage: 23, cores: 4 },
    uptime: '15 days, 3 hours',
    lastBackup: '2 hours ago',
    activeUsers: 127,
    requestsPerMinute: 324
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        cpu: { ...prev.cpu, usage: Math.floor(Math.random() * 40) + 10 },
        memory: { ...prev.memory, usage: Math.floor(Math.random() * 30) + 50 },
        requestsPerMinute: Math.floor(Math.random() * 200) + 250,
        activeUsers: Math.floor(Math.random() * 50) + 100
      }));
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    setLastUpdated(new Date());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-600">Kết nối</Badge>;
      case 'warning':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-600">Cảnh báo</Badge>;
      case 'error':
        return <Badge variant="destructive">Lỗi</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            <CardTitle>Trạng thái hệ thống</CardTitle>
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
          {/* Real-time Metrics */}
          <div>
            <h4 className="font-medium mb-3">Metrics thời gian thực</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Người dùng online</p>
                </div>
                <p className="text-2xl font-bold">{systemStatus.activeUsers}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-muted-foreground">Requests/phút</p>
                </div>
                <p className="text-2xl font-bold">{systemStatus.requestsPerMinute}</p>
              </div>
            </div>
          </div>

          {/* Services Status */}
          <div>
            <h4 className="font-medium mb-3">Trạng thái dịch vụ</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">PostgreSQL Database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {systemStatus.database.responseTime}
                  </span>
                  {getStatusIcon(systemStatus.database.status)}
                  {getStatusBadge(systemStatus.database.status)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Server className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Redis Cache</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {systemStatus.redis.responseTime}
                  </span>
                  {getStatusIcon(systemStatus.redis.status)}
                  {getStatusBadge(systemStatus.redis.status)}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">API Server</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {systemStatus.api.responseTime}
                  </span>
                  {getStatusIcon(systemStatus.api.status)}
                  {getStatusBadge(systemStatus.api.status)}
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
                    <Cpu className="h-4 w-4 text-blue-600" />
                    <span>CPU Usage</span>
                  </div>
                  <span className={`font-medium ${
                    systemStatus.cpu.usage > 80 ? 'text-red-600' : 
                    systemStatus.cpu.usage > 60 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {systemStatus.cpu.usage}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      systemStatus.cpu.usage > 80 ? 'bg-red-500' : 
                      systemStatus.cpu.usage > 60 ? 'bg-yellow-500' : 
                      'bg-blue-500'
                    }`}
                    style={{ width: `${systemStatus.cpu.usage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span>Memory Usage</span>
                  </div>
                  <span className={`font-medium ${
                    systemStatus.memory.usage > 80 ? 'text-red-600' : 
                    systemStatus.memory.usage > 60 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {systemStatus.memory.usage}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      systemStatus.memory.usage > 80 ? 'bg-red-500' : 
                      systemStatus.memory.usage > 60 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${systemStatus.memory.usage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-orange-600" />
                    <span>Disk Usage</span>
                  </div>
                  <span className={`font-medium ${
                    systemStatus.disk.usage > 80 ? 'text-red-600' : 
                    systemStatus.disk.usage > 60 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {systemStatus.disk.usage}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      systemStatus.disk.usage > 80 ? 'bg-red-500' : 
                      systemStatus.disk.usage > 60 ? 'bg-yellow-500' : 
                      'bg-orange-500'
                    }`}
                    style={{ width: `${systemStatus.disk.usage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div>
            <h4 className="font-medium mb-3">Thông tin hệ thống</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium">{systemStatus.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPU Cores:</span>
                  <span className="font-medium">{systemStatus.cpu.cores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Memory:</span>
                  <span className="font-medium">{systemStatus.memory.total}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Backup:</span>
                  <span className="font-medium">{systemStatus.lastBackup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Disk:</span>
                  <span className="font-medium">{systemStatus.disk.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">v1.0.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Activity className="h-3 w-3" />
                System Health
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Database className="h-3 w-3" />
                Backup Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
