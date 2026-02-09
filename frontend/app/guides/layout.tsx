import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hướng dẫn | Audio Tài Lộc',
  description: 'Hướng dẫn chi tiết cách sử dụng, lắp đặt và bảo dưỡng thiết bị âm thanh. Chia sẻ kinh nghiệm từ chuyên gia Audio Tài Lộc.',
  keywords: 'hướng dẫn sử dụng, guides, lắp đặt âm thanh, bảo dưỡng thiết bị',
  openGraph: {
    title: 'Hướng dẫn | Audio Tài Lộc',
    description: 'Hướng dẫn chi tiết cách sử dụng, lắp đặt và bảo dưỡng thiết bị âm thanh từ chuyên gia.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Hướng dẫn Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/guides`,
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
