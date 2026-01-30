import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Thanh toán | Audio Tài Lộc',
 description: 'Hoàn tất đơn hàng của bạn tại Audio Tài Lộc',
 robots: {
 index: false,
 follow: false,
 },
};

export default function CheckoutLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}
