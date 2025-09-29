import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Kiến thức | Audio Tài Lộc',
  description: 'Khám phá kiến thức âm thanh, hướng dẫn sử dụng, và những thông tin hữu ích từ Audio Tài Lộc. Đọc các bài viết về âm thanh, kỹ thuật, chính sách và nhiều hơn nữa.',
  keywords: [
    'blog âm thanh',
    'kiến thức audio',
    'hướng dẫn âm thanh',
    'tai nghe',
    'loa',
    'kỹ thuật âm thanh',
    'chính sách',
    'bảo hành',
    'Audio Tài Lộc'
  ],
  authors: [{ name: 'Audio Tài Lộc' }],
  openGraph: {
    title: 'Blog & Kiến thức | Audio Tài Lộc',
    description: 'Khám phá kiến thức âm thanh, hướng dẫn sử dụng, và những thông tin hữu ích từ Audio Tài Lộc.',
    type: 'website',
    url: '/blog-new',
    siteName: 'Audio Tài Lộc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Kiến thức | Audio Tài Lộc',
    description: 'Khám phá kiến thức âm thanh, hướng dẫn sử dụng, và những thông tin hữu ích từ Audio Tài Lộc.',
  },
  alternates: {
    canonical: '/blog-new',
  },
  other: {
    'article:author': 'Audio Tài Lộc',
  },
};

export default function BlogNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}