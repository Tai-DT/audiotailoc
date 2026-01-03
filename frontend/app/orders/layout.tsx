import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn hàng | Audio Tài Lộc',
  description: 'Xem lịch sử và quản lý đơn hàng của bạn tại Audio Tài Lộc',
  robots: { index: false, follow: false },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
