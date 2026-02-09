import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đánh giá | Audio Tài Lộc',
  description: 'Đọc đánh giá chi tiết về các sản phẩm thiết bị âm thanh từ chuyên gia và khách hàng. Tham khảo trước khi mua hàng tại Audio Tài Lộc.',
  keywords: 'đánh giá sản phẩm, reviews, nhận xét, feedback khách hàng',
  openGraph: {
    title: 'Đánh giá | Audio Tài Lộc',
    description: 'Đọc đánh giá chi tiết về các sản phẩm thiết bị âm thanh từ chuyên gia và khách hàng.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Đánh giá Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/reviews`,
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
