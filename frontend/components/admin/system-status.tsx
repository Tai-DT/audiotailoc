'use client';

import React from 'react';
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
  XCircle
} from 'lucide-react';

export function SystemStatus() {
  // Mock data - in real app, this would come from API
  const systemStatus = {
    database: { status: 'connected', responseTime: '2ms' },
    redis: { status: 'connected', responseTime: '1ms' },
    disk: { usage: 45, total: '100GB' },
    memory: { usage: 68, total: '8GB' },
    cpu: { usage: 23, cores: 4 },
    uptime: '15 days, 3 hours',
    lastBackup: '2 hours ago'
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
        <CardTitle>Trạng thái hệ thống</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Services Status */}
          <div>
            <h4 className="font-medium mb-3">Dịch vụ</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm">Database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {systemStatus.database.responseTime}
                  </span>
                  {getStatusIcon(systemStatus.database.status)}
                  {getStatusBadge(systemStatus.database.status)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4" />
                  <span className="text-sm">Redis Cache</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {systemStatus.redis.responseTime}
                  </span>
                  {getStatusIcon(systemStatus.redis.status)}
                  {getStatusBadge(systemStatus.redis.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Resource Usage */}
          <div>
            <h4 className="font-medium mb-3">Tài nguyên</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>{systemStatus.cpu.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${systemStatus.cpu.usage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>{systemStatus.memory.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${systemStatus.memory.usage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disk Usage</span>
                  <span>{systemStatus.disk.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${systemStatus.disk.usage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div>
            <h4 className="font-medium mb-3">Thông tin hệ thống</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime:</span>
                <span>{systemStatus.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Backup:</span>
                <span>{systemStatus.lastBackup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPU Cores:</span>
                <span>{systemStatus.cpu.cores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Memory:</span>
                <span>{systemStatus.memory.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Disk:</span>
                <span>{systemStatus.disk.total}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              Kiểm tra hệ thống
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Sao lưu dữ liệu
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
