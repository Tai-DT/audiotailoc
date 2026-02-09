import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cửa hàng | Audio Tài Lộc',
  description: 'Tìm kiếm địa chỉ cửa hàng Audio Tài Lộc gần bạn. Hệ thống showroom trải dài khắp cả nước với đội ngũ nhân viên chuyên nghiệp, tận tâm.',
  keywords: 'cửa hàng audio tài lộc, địa chỉ showroom, stores, chi nhánh',
  openGraph: {
    title: 'Cửa hàng | Audio Tài Lộc',
    description: 'Tìm kiếm địa chỉ cửa hàng Audio Tài Lộc gần bạn với hệ thống showroom trải dài khắp cả nước.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Cửa hàng Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/stores`,
  },
};

export default function StoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
