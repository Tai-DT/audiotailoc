export const metadata = {
  title: 'Quản trị Audio Tài Lộc',
  description: 'Bảng điều khiển quản trị',
};

import Link from 'next/link';
import { cookies } from 'next/headers';
import FlashBanner from './FlashBanner';
import { apiFetch } from './lib/api';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = cookies();
  const token = c.get('accessToken')?.value;
  let me: { userId: string | null; email?: string | null; role?: string | null } | null = null;
  if (token) {
    try {
      me = await apiFetch('/auth/me');
    } catch {}
  }
  const flashRaw = c.get('flash')?.value;
  let flash: { type?: 'success' | 'error'; message: string } | null = null;
  if (flashRaw) {
    try {
      flash = JSON.parse(flashRaw);
    } catch {
      flash = null;
    }
    // Clear after reading
    c.set('flash', '', { path: '/', httpOnly: true, maxAge: 0 });
  }
  return (
    <html lang="en">
      <body>
        {flash ? <FlashBanner type={flash.type} message={flash.message} /> : null}
        <header style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 16 }}>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link href="/">Trang chủ</Link>
            <Link href="/products">Sản phẩm</Link>
            {me?.role === 'ADMIN' ? <Link href="/products/new">Tạo sản phẩm</Link> : null}
          </nav>
          <div style={{ marginLeft: 'auto' }}>
            {token ? (
              <form action="/api/auth/logout" method="POST" style={{ display: 'inline' }}>
                {me?.role === 'ADMIN' ? <span style={{ marginRight: 8, padding: '2px 6px', border: '1px solid #333', borderRadius: 6, fontSize: 12 }}>Admin</span> : null}
                <button type="submit">Đăng xuất</button>
              </form>
            ) : (
              <Link href="/login">Đăng nhập</Link>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
