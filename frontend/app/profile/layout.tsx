import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ | Audio Tài Lộc',
  description: 'Quản lý thông tin tài khoản của bạn tại Audio Tài Lộc',
  robots: { index: false, follow: false },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
