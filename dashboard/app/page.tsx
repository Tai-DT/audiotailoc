import { Suspense } from 'react';
import AdminNotice from './AdminNotice';
import { apiFetch } from './lib/api';
import DashboardContent from './components/DashboardContent';

export default async function AdminHome() {
  const me = await apiFetch<{ role?: string }>('/auth/me').catch(() => null);
  const isAdmin = me?.role === 'ADMIN';

  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động cửa hàng Audio Tài Lộc</p>
        </div>
        {!isAdmin && (
          <AdminNotice>Đây là khu vực quản trị. Bạn đang ở chế độ xem chỉ đọc.</AdminNotice>
        )}
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    }>
      <DashboardContent isAdmin={isAdmin} />
    </Suspense>
  );
}

