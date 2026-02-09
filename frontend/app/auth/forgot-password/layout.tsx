import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quên mật khẩu | Audio Tài Lộc',
  description: 'Khôi phục mật khẩu tài khoản Audio Tài Lộc của bạn',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
