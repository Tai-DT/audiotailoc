import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Kiến thức âm thanh | Audio Tài Lộc',
  description: 'Khám phá những bài viết hữu ích về âm thanh, karaoke và thiết bị chuyên nghiệp từ Audio Tài Lộc.',
  keywords: ['blog âm thanh', 'kiến thức karaoke', 'hướng dẫn loa', 'tin tức audio'],
  openGraph: {
    title: 'Blog - Kiến thức âm thanh | Audio Tài Lộc',
    description: 'Khám phá những bài viết hữu ích về âm thanh, karaoke và thiết bị chuyên nghiệp.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Audio Tài Lộc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Kiến thức âm thanh | Audio Tài Lộc',
    description: 'Khám phá những bài viết hữu ích về âm thanh, karaoke và thiết bị chuyên nghiệp.',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
