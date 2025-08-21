import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản trị Audio Tài Lộc',
    template: '%s | Admin Dashboard'
  },
  description: 'Bảng điều khiển quản trị cửa hàng Audio Tài Lộc',
};

import Link from 'next/link';
import './globals.css';
import { cookies } from 'next/headers';
import FlashBanner from './FlashBanner';
import { apiFetch } from './lib/api';
import RealtimeNotice from './RealtimeNotice';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const token = c.get('accessToken')?.value;
  let me: { userId: string | null; email?: string | null; role?: string | null } | null = null;
  if (token) {
    try {
      me = await apiFetch<{ userId: string | null; email?: string | null; role?: string | null }>(
        '/auth/me'
      );
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
    // Note: Next.js 15 cookies API is async and mutating in RSC isn't supported across all runtimes; consider clearing via route action
  }
  return (
    <html lang="vi">
      <body className="min-h-screen bg-background font-sans antialiased">
        {flash ? <FlashBanner type={flash.type} message={flash.message} /> : null}

        {/* Admin Sidebar */}
        <div className="flex h-screen">
          <aside className="w-64 bg-gray-900 text-white">
            <div className="p-6">
              <h1 className="text-xl font-bold">🎵 Audio Tài Lộc</h1>
              <p className="text-sm text-gray-400">Admin Dashboard</p>
            </div>

            <nav className="mt-6">
              <div className="px-6 py-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</h3>
              </div>
              <div className="mt-2 space-y-1">
                <Link href="/" className="flex items-center px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
                  📊 Dashboard
                </Link>
                <Link href="/products" className="flex items-center px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
                  📦 Sản phẩm
                </Link>
                {me?.role === 'ADMIN' && (
                  <>
                    <Link href="/products/new" className="flex items-center px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
                      ➕ Tạo sản phẩm
                    </Link>
                    <Link href="/orders" className="flex items-center px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
                      🛒 Đơn hàng
                    </Link>
                    <Link href="/inventory" className="flex items-center px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
                      📋 Kho hàng
                    </Link>
                    <Link href="/users" className="flex items-center px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
                      👥 Người dùng
                    </Link>
                    <Link href="/categories" className="flex items-center px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
                      🏷️ Danh mục
                    </Link>
                    <Link href="/analytics" className="flex items-center px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
                      📈 Thống kê
                    </Link>
                  </>
                )}
              </div>
            </nav>

            <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
              {token ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{me?.email}</p>
                    {me?.role === 'ADMIN' && (
                      <span className="inline-block px-2 py-1 text-xs bg-blue-600 text-white rounded">Admin</span>
                    )}
                  </div>
                  <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Đăng xuất
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Đăng nhập
                </Link>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        <RealtimeNotice />
      </body>
    </html>
  );
}
