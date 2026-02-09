import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký nhận tin | Audio Tài Lộc',
  description: 'Đăng ký nhận bản tin từ Audio Tài Lộc để cập nhật tin tức mới nhất, chương trình khuyến mãi và ưu đãi đặc biệt dành cho bạn.',
  keywords: 'đăng ký newsletter, nhận tin, email marketing, khuyến mãi',
  openGraph: {
    title: 'Đăng ký nhận tin | Audio Tài Lộc',
    description: 'Đăng ký nhận bản tin để cập nhật tin tức và ưu đãi đặc biệt từ Audio Tài Lộc.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Newsletter Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/newsletter`,
  },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
