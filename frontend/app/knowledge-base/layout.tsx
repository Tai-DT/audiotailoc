import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kiến thức âm thanh | Audio Tài Lộc',
  description: 'Thư viện kiến thức về thiết bị và kỹ thuật âm thanh từ Audio Tài Lộc',
  keywords: ['kiến thức âm thanh', 'hướng dẫn', 'kỹ thuật', 'Audio Tài Lộc'],
  openGraph: {
    title: 'Kiến thức âm thanh | Audio Tài Lộc',
    description: 'Thư viện kiến thức về thiết bị và kỹ thuật âm thanh',
    type: 'website',
    url: '/knowledge-base',
  },
};

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
