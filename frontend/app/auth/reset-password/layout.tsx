import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu | Audio Tài Lộc',
  description: 'Đặt lại mật khẩu mới cho tài khoản Audio Tài Lộc của bạn',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
