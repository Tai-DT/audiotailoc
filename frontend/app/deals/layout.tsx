import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ưu đãi đặc biệt | Audio Tài Lộc',
  description: 'Khám phá các chương trình ưu đãi, giảm giá đặc biệt cho sản phẩm thiết bị âm thanh tại Audio Tài Lộc. Cập nhật mỗi ngày.',
  keywords: 'ưu đãi, deals, giảm giá, khuyến mãi, flash sale',
  openGraph: {
    title: 'Ưu đãi đặc biệt | Audio Tài Lộc',
    description: 'Khám phá các chương trình ưu đãi và giảm giá đặc biệt tại Audio Tài Lộc.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Ưu đãi Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/deals`,
  },
};

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
