import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách đổi trả | Audio Tài Lộc',
  description: 'Quy định và hướng dẫn đổi trả hàng tại Audio Tài Lộc',
};

export default function ReturnPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
