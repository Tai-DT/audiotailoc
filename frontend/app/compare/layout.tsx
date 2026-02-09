import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'So sánh sản phẩm | Audio Tài Lộc',
  description: 'So sánh các sản phẩm thiết bị âm thanh để tìm lựa chọn phù hợp nhất. Công cụ so sánh chi tiết từ Audio Tài Lộc.',
  keywords: 'so sánh sản phẩm, compare, đối chiếu, tính năng',
  openGraph: {
    title: 'So sánh sản phẩm | Audio Tài Lộc',
    description: 'Công cụ so sánh sản phẩm thiết bị âm thanh chi tiết tại Audio Tài Lộc.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'So sánh sản phẩm Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/compare`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
