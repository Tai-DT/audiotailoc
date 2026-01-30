import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Hỗ trợ | Audio Tài Lộc',
 description: 'Trung tâm hỗ trợ khách hàng Audio Tài Lộc - Giải đáp thắc mắc, hỗ trợ kỹ thuật 24/7',
 keywords: ['hỗ trợ', 'support', 'Audio Tài Lộc', 'kỹ thuật'],
 openGraph: {
 title: 'Hỗ trợ | Audio Tài Lộc',
 description: 'Trung tâm hỗ trợ khách hàng Audio Tài Lộc',
 type: 'website',
 url: '/support',
 },
};

export default function SupportLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}
