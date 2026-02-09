import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch sử thanh toán | Audio Tài Lộc',
  description: 'Xem lịch sử thanh toán của bạn tại Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
