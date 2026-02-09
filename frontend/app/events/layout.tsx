import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sự kiện | Audio Tài Lộc',
  description: 'Tham gia các sự kiện, hội thảo và triển lãm thiết bị âm thanh do Audio Tài Lộc tổ chức. Cơ hội trải nghiệm và gặp gỡ chuyên gia.',
  keywords: 'sự kiện âm thanh, events, hội thảo, triển lãm, audio tài lộc',
  openGraph: {
    title: 'Sự kiện | Audio Tài Lộc',
    description: 'Tham gia các sự kiện và hội thảo về thiết bị âm thanh do Audio Tài Lộc tổ chức.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sự kiện Audio Tài Lộc',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/events`,
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
