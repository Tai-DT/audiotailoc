import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt lịch dịch vụ | Audio Tài Lộc',
  description: 'Đặt lịch sử dụng dịch vụ lắp đặt, bảo trì thiết bị âm thanh tại Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ServiceBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
