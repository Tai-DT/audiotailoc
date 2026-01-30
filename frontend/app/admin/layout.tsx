import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Quản trị | Audio Tài Lộc',
 robots: {
 index: false,
 follow: false,
 },
};

export default function AdminLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}
