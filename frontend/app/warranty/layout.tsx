import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách bảo hành | Audio Tài Lộc',
  description: 'Quy định và cam kết bảo hành sản phẩm tại Audio Tài Lộc',
};

export default function WarrantyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
