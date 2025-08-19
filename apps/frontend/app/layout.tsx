export const metadata = {
  title: 'Cửa hàng Audio Tài Lộc',
  description: 'Cửa hàng trực tuyến',
};

import Link from 'next/link';
import ChatWidget from './components/ChatWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 16 }}>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link href="/">Trang chủ</Link>
            <Link href="/products">Sản phẩm</Link>
            <Link href="/services">Dịch vụ</Link>
            <Link href="/about">Giới thiệu</Link>
            <Link href="/contact">Liên hệ</Link>
          </nav>
          <nav style={{ marginLeft: 'auto' }}>
            <Link href="/login">Đăng nhập</Link>
          </nav>
        </header>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
