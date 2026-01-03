import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ | Audio Tài Lộc',
  description: 'Liên hệ Audio Tài Lộc để được tư vấn về thiết bị và dịch vụ âm thanh chuyên nghiệp. Hotline: 0768 426 262',
  keywords: [
    'liên hệ',
    'Audio Tài Lộc',
    'địa chỉ',
    'hotline',
    'tư vấn âm thanh',
    'TP.HCM',
  ],
  openGraph: {
    title: 'Liên hệ | Audio Tài Lộc',
    description: 'Liên hệ Audio Tài Lộc để được tư vấn về thiết bị và dịch vụ âm thanh chuyên nghiệp.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
