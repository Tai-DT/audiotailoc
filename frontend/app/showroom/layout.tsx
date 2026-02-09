import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Showroom | Audio Tài Lộc',
  description: 'Ghé thăm showroom Audio Tài Lộc để trải nghiệm trực tiếp các sản phẩm thiết bị âm thanh cao cấp. Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ.',
  keywords: 'showroom audio tài lộc, trải nghiệm sản phẩm, cửa hàng trưng bày',
  openGraph: {
    title: 'Showroom | Audio Tài Lộc',
    description: 'Ghé thăm showroom Audio Tài Lộc để trải nghiệm trực tiếp các sản phẩm thiết bị âm thanh cao cấp.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Showroom Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/showroom`,
  },
};

export default function ShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
