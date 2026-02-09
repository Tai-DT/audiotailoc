import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin tức | Audio Tài Lộc',
  description: 'Cập nhật tin tức mới nhất về công nghệ âm thanh, sự kiện khuyến mãi, và xu hướng thiết bị audio tại Audio Tài Lộc.',
  keywords: 'tin tức âm thanh, news, sự kiện, khuyến mãi, audio tài lộc',
  openGraph: {
    title: 'Tin tức | Audio Tài Lộc',
    description: 'Cập nhật tin tức mới nhất về công nghệ âm thanh và sự kiện khuyến mãi tại Audio Tài Lộc.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Tin tức Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/news`,
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
