import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tra cứu đơn hàng | Audio Tài Lộc',
  description: 'Theo dõi tình trạng đơn hàng của bạn tại Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
