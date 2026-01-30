import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Sản phẩm | Audio Tài Lộc',
 description: 'Khám phá các sản phẩm âm thanh chất lượng cao: loa, amply, micro, mixer và nhiều thiết bị khác tại Audio Tài Lộc',
 keywords: ['sản phẩm', 'loa', 'amply', 'micro', 'mixer', 'Audio Tài Lộc'],
 openGraph: {
 title: 'Sản phẩm | Audio Tài Lộc',
 description: 'Khám phá các sản phẩm âm thanh chất lượng cao tại Audio Tài Lộc',
 type: 'website',
 url: '/products',
 },
};

export default function ProductsLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}
