import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm kiếm | Audio Tài Lộc',
  description: 'Tìm kiếm sản phẩm và dịch vụ âm thanh tại Audio Tài Lộc',
  robots: { index: false, follow: false },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
