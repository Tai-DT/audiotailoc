import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý tài khoản | Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CustomerAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
