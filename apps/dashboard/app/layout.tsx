export const metadata = {
  title: 'Quản trị Audio Tài Lộc',
  description: 'Bảng điều khiển quản trị',
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
    // Note: Next.js 15 cookies API is async and mutating in RSC isn't supported across all runtimes; consider clearing via route action
  }
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {flash ? <FlashBanner type={flash.type} message={flash.message} /> : null}
        
        {/* Main Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/" className="text-2xl font-bold text-blue-600">
                    Audio Tài Lộc
                  </Link>
                </div>
                <nav className="hidden md:ml-8 md:flex md:space-x-8">
                  <Link 
                    href="/" 
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Trang chủ
                  </Link>
                  <Link 
                    href="/products" 
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Sản phẩm
                  </Link>
                  {me?.role === 'ADMIN' ? (
                    <Link 
                      href="/products/new" 
                      className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      Tạo sản phẩm
                    </Link>
                  ) : null}
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                {token ? (
                  <div className="flex items-center space-x-3">
                    {me?.role === 'ADMIN' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    ) : null}
                    <form action="/api/auth/logout" method="POST" className="inline">
                      <button 
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Secondary Navigation */}
        <nav className="bg-gray-100 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 h-12">
              <Link 
                href="/inventory" 
                className="text-gray-700 hover:text-gray-900 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-500"
              >
                📦 Kho hàng
              </Link>
              <Link 
                href="/orders" 
                className="text-gray-700 hover:text-gray-900 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-500"
              >
                📋 Đơn hàng
              </Link>
              <Link 
                href="/customers" 
                className="text-gray-700 hover:text-gray-900 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-500"
              >
                👥 Khách hàng
              </Link>
              <Link 
                href="/analytics" 
                className="text-gray-700 hover:text-gray-900 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-500"
              >
                📊 Thống kê
              </Link>
              <Link 
                href="/settings" 
                className="text-gray-700 hover:text-gray-900 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-500"
              >
                ⚙️ Cài đặt
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
        <RealtimeNotice />
      </body>
    </html>
  );
}
