import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Hỗ trợ trực tuyến | Audio Tài Lộc',
 description: 'Chat trực tiếp với đội ngũ hỗ trợ Audio Tài Lộc',
 robots: {
 index: false,
 follow: false,
 },
};

export default function ChatLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}
