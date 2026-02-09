import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Dự án | Audio Tài Lộc',
 description: 'Xem các dự án âm thanh đã được Audio Tài Lộc triển khai: hội trường, nhà hàng, quán karaoke, sự kiện và nhiều hơn nữa',
 keywords: [
 'dự án âm thanh',
 'lắp đặt hội trường',
 'âm thanh nhà hàng',
 'karaoke',
 'sự kiện',
 'Audio Tài Lộc',
 ],
 openGraph: {
 title: 'Dự án | Audio Tài Lộc',
 description: 'Xem các dự án âm thanh đã được Audio Tài Lộc triển khai',
 type: 'website',
 url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/du-an`,
 images: [
  {
   url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
   width: 1200,
   height: 630,
   alt: 'Dự án Audio Tài Lộc',
  },
 ],
 },
 alternates: {
 canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/du-an`,
 },
};

export default function ProjectsLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}
