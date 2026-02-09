import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn dịch vụ | Audio Tài Lộc',
  description: 'Xem và quản lý đơn dịch vụ của bạn tại Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ServiceOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
