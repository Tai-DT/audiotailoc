import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh mục sản phẩm | Audio Tài Lộc',
  description: 'Xem sản phẩm theo danh mục: loa, amply, micro, mixer và nhiều thiết bị âm thanh khác tại Audio Tài Lộc',
  keywords: [
    'danh mục',
    'loa',
    'amply',
    'micro',
    'mixer',
    'thiết bị âm thanh',
    'Audio Tài Lộc',
  ],
  openGraph: {
    title: 'Danh mục sản phẩm | Audio Tài Lộc',
    description: 'Xem sản phẩm theo danh mục tại Audio Tài Lộc',
    type: 'website',
    url: '/danh-muc',
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
