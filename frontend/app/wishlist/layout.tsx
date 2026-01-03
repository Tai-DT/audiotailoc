import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yêu thích | Audio Tài Lộc',
  description: 'Danh sách sản phẩm yêu thích của bạn tại Audio Tài Lộc',
  robots: { index: false, follow: false },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
