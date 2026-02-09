import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký | Audio Tài Lộc',
  description: 'Tạo tài khoản mới tại Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
