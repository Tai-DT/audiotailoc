import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phản hồi khách hàng | Audio Tài Lộc',
  description: 'Xem phản hồi và đánh giá từ khách hàng đã sử dụng sản phẩm và dịch vụ của Audio Tài Lộc. Trải nghiệm thực tế từ người tiêu dùng.',
  keywords: 'phản hồi khách hàng, testimonials, đánh giá, reviews, khách hàng hài lòng',
  openGraph: {
    title: 'Phản hồi khách hàng | Audio Tài Lộc',
    description: 'Xem phản hồi và đánh giá từ khách hàng đã sử dụng sản phẩm và dịch vụ của Audio Tài Lộc.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Phản hồi khách hàng Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/testimonials`,
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
