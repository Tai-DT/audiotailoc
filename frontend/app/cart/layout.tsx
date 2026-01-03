import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giỏ hàng | Audio Tài Lộc',
  description: 'Xem và quản lý giỏ hàng của bạn tại Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
