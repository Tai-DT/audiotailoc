import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch sử đặt lịch | Audio Tài Lộc',
  description: 'Xem lịch sử đặt lịch dịch vụ của bạn tại Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
