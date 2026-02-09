import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp | Audio Tài Lộc',
  description: 'Tìm câu trả lời cho các câu hỏi thường gặp về sản phẩm, dịch vụ, chính sách bảo hành, vận chuyển và thanh toán tại Audio Tài Lộc.',
  keywords: 'câu hỏi thường gặp, FAQ, hỏi đáp, hỗ trợ khách hàng, audio tài lộc',
  openGraph: {
    title: 'Câu hỏi thường gặp | Audio Tài Lộc',
    description: 'Tìm câu trả lời cho các câu hỏi thường gặp về sản phẩm và dịch vụ tại Audio Tài Lộc.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Audio Tài Lộc FAQ',
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/faq`,
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
