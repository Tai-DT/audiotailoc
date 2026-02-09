import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thương hiệu | Audio Tài Lộc',
  description: 'Khám phá các thương hiệu thiết bị âm thanh hàng đầu thế giới được phân phối chính hãng tại Audio Tài Lộc. Chất lượng đảm bảo, giá cả cạnh tranh.',
  keywords: 'thương hiệu âm thanh, brands, nhãn hiệu chính hãng, thiết bị audio',
  openGraph: {
    title: 'Thương hiệu | Audio Tài Lộc',
    description: 'Khám phá các thương hiệu thiết bị âm thanh hàng đầu được phân phối chính hãng tại Audio Tài Lộc.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Thương hiệu Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/brands`,
  },
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
