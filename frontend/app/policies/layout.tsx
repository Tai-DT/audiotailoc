import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách | Audio Tài Lộc',
  description: 'Các điều khoản và chính sách tại Audio Tài Lộc',
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
