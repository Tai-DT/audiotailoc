import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Dịch vụ | Audio Tài Lộc',
 description: 'Dịch vụ lắp đặt, sửa chữa và bảo trì hệ thống âm thanh chuyên nghiệp tại Audio Tài Lộc',
 keywords: ['dịch vụ', 'lắp đặt âm thanh', 'sửa chữa', 'bảo trì', 'Audio Tài Lộc'],
 openGraph: {
 title: 'Dịch vụ | Audio Tài Lộc',
 description: 'Dịch vụ lắp đặt, sửa chữa và bảo trì hệ thống âm thanh chuyên nghiệp',
 type: 'website',
 url: '/services',
 },
};

export default function ServicesLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}
