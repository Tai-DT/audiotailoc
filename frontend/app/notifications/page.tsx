'use client';

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '@/lib/api-client';

type NotificationItem = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  readAt?: string;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});

  const fetchList = useCallback(async (page = 1) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/notifications?userId=${encodeURIComponent(userId)}&read=false&page=${page}&limit=20`);
      const data: any = res as any;
      const list = (data?.notifications || []) as NotificationItem[];
      setItems(list);
      setPagination(data?.pagination || { page, limit: 20, total: list.length, totalPages: 1 });
    } catch (e: any) {
      setError(e?.message || 'Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await apiClient.get('/auth/me');
        const uid = (me as any)?.userId || null;
        if (mounted) setUserId(uid);
        if (uid) {
          await fetchList(1);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Bạn cần đăng nhập');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [fetchList]);

  const markAllRead = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await apiClient.post('/notifications/mark-all-read', { userId });
      await fetchList(1);
    } catch (e: any) {
      setError(e?.message || 'Không thể cập nhật');
    } finally {
      setLoading(false);
    }
  };

  const markOneRead = async (id: string) => {
    if (!userId) return;
    setBusyIds(prev => ({ ...prev, [id]: true }));
    try {
      await apiClient.post('/notifications/mark-read', { notificationId: id, userId });
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e?.message || 'Không thể cập nhật');
    } finally {
      setBusyIds(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
            <p className="text-gray-600">Xem và quản lý thông báo của bạn</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchList(pagination.page)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
            >
              Làm mới
            </button>
            <button
              onClick={markAllRead}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              disabled={loading || !userId || items.length === 0}
            >
              Đánh dấu đã đọc tất cả
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border">
            <div className="text-5xl mb-2">📭</div>
            <h3 className="text-lg font-semibold">Không có thông báo mới</h3>
            <p className="text-gray-600">Bạn sẽ thấy thông báo mới tại đây</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((n) => (
              <li key={n.id} className="bg-white rounded-lg border p-4 flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                  <div className="mt-1 font-semibold">{n.title}</div>
                  <div className="text-gray-700">{n.message}</div>
                  {n.type && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">{n.type}</span>
                  )}
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => markOneRead(n.id)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    disabled={!!busyIds[n.id]}
                  >
                    {busyIds[n.id] ? 'Đang cập nhật...' : 'Đánh dấu đã đọc'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

