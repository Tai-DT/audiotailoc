"use client"

import { useState, useEffect } from 'react';
import { useOrderNotifications } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationCenterProps {
  userId?: string;
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const { notifications, clearNotifications, removeNotification, connected } = useOrderNotifications(userId);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setHasUnread(true);
    }
  }, [notifications]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_update': return '📦';
      case 'payment': return '💳';
      case 'shipping': return '🚚';
      case 'promotion': return '🎉';
      default: return '🔔';
    }
  };

  if (!userId) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={handleOpen}
        className="relative p-2 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Thông báo"
      >
        <span className="text-lg">🔔</span>
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* Connection Status */}
      <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
        connected ? 'bg-green-500' : 'bg-red-500'
      }`} title={connected ? 'Đã kết nối' : 'Mất kết nối'}></div>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold">Thông báo</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
                className="text-xs"
              >
                Xóa tất cả
              </Button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <span className="text-4xl mb-2 block">🔔</span>
                <p>Không có thông báo mới</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        aria-label="Xóa thông báo"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!connected && (
            <div className="p-3 bg-yellow-50 border-t border-yellow-200">
              <p className="text-xs text-yellow-800 text-center">
                ⚠️ Mất kết nối real-time. Đang thử kết nối lại...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}

// Toast notification component for immediate feedback
export function NotificationToast({ notification, onClose }: { 
  notification: any; 
  onClose: () => void; 
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <span>{getNotificationIcon(notification.type)}</span>
            <span>{notification.title}</span>
          </CardTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription>{notification.message}</CardDescription>
      </CardContent>
    </Card>
  );
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'order_update': return '📦';
    case 'payment': return '💳';
    case 'shipping': return '🚚';
    case 'promotion': return '🎉';
    default: return '🔔';
  }
}
