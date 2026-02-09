import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập | Audio Tài Lộc',
  description: 'Đăng nhập vào tài khoản của bạn tại Audio Tài Lộc',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
