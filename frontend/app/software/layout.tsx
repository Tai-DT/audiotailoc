import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phần mềm | Audio Tài Lộc',
  description: 'Mua và tải phần mềm bản quyền tại Audio Tài Lộc. Thanh toán PayOS và tải xuống ngay sau khi giao dịch hoàn tất.',
  keywords: ['phần mềm', 'tải xuống', 'bản quyền', 'PayOS', 'Audio Tài Lộc'],
  openGraph: {
    title: 'Phần mềm | Audio Tài Lộc',
    description: 'Mua và tải phần mềm bản quyền tại Audio Tài Lộc',
    type: 'website',
    url: '/software',
  },
};

export default function SoftwareLayout({ children }: { children: React.ReactNode }) {
  return children;
}

