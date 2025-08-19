import AdminNotice from './AdminNotice';
import { apiFetch } from './lib/api';

export default async function AdminHome() {
  const me = await apiFetch<{ role?: string }>('/auth/me').catch(() => null);
  const isAdmin = me?.role === 'ADMIN';
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard Home</h1>
      {!isAdmin ? <AdminNotice>Đây là khu vực quản trị. Bạn đang ở chế độ xem chỉ đọc.</AdminNotice> : null}
    </main>
  );
}

