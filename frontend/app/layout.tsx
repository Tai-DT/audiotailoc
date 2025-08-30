import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import AIChatWidgetProvider from '@/components/ai/AIChatWidgetProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Audio Tài Lộc - Nâng tầm trải nghiệm âm thanh',
    template: '%s | Audio Tài Lộc'
  },
  description: 'Cửa hàng audio chuyên nghiệp với các sản phẩm chất lượng cao. Tai nghe, loa, ampli và phụ kiện âm thanh chính hãng, giá tốt nhất thị trường.',
  keywords: ['audio', 'tai nghe', 'loa', 'ampli', 'âm thanh', 'chất lượng cao', 'chính hãng', 'đồ nghe nhạc', 'phụ kiện âm thanh'],
  authors: [{ name: 'Audio Tài Lộc' }],
  creator: 'Audio Tài Lộc',
  publisher: 'Audio Tài Lộc',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'Audio Tài Lộc - Nâng tầm trải nghiệm âm thanh',
    description: 'Cửa hàng audio chuyên nghiệp với các sản phẩm chất lượng cao. Tai nghe, loa, ampli và phụ kiện âm thanh chính hãng.',
    siteName: 'Audio Tài Lộc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Tài Lộc - Nâng tầm trải nghiệm âm thanh',
    description: 'Cửa hàng audio chuyên nghiệp với các sản phẩm chất lượng cao.',
  },
};


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <AIChatWidgetProvider />
        <Toaster />
      </body>
    </html>
  );
}
