import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu | Audio Tài Lộc',
  description: 'Tìm hiểu về Audio Tài Lộc - đơn vị cung cấp thiết bị âm thanh chuyên nghiệp hàng đầu tại Việt Nam. Chúng tôi cam kết mang đến sản phẩm chất lượng và dịch vụ tốt nhất cho khách hàng.',
  keywords: 'giới thiệu audio tài lộc, về chúng tôi, thiết bị âm thanh chuyên nghiệp, lịch sử hình thành',
  openGraph: {
    title: 'Giới thiệu | Audio Tài Lộc',
    description: 'Tìm hiểu về Audio Tài Lộc - đơn vị cung cấp thiết bị âm thanh chuyên nghiệp hàng đầu tại Việt Nam.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/about`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
