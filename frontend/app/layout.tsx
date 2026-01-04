import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { OrganizationStructuredData } from "@/components/seo/organization-structured-data";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { WebVitalsReporter } from "@/components/analytics/web-vitals-reporter";
import { LazyChatWidget } from "@/components/ui/lazy-chat-widget";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Canonical / metadata base selection logic
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL || "https://audiotailoc.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp | Dàn Karaoke, Loa, Ampli, Micro",
    template: "%s | Audio Tài Lộc",
  },
  description: "Audio Tài Lộc - Chuyên cung cấp thiết bị âm thanh chất lượng cao: Dàn karaoke gia đình, Loa JBL, Ampli, Micro không dây, Mixer. Dịch vụ lắp đặt, bảo hành tại TP.HCM. Hotline: 0768 426 262",
  keywords: [
    "thiết bị âm thanh",
    "dàn karaoke",
    "loa karaoke",
    "loa JBL",
    "loa Bose",
    "amplifier",
    "ampli karaoke",
    "micro không dây",
    "micro Shure",
    "mixer",
    "hệ thống âm thanh",
    "âm thanh hội nghị",
    "âm thanh sân khấu",
    "loa bluetooth",
    "sub điện",
    "bộ dàn karaoke gia đình",
    "mua loa karaoke",
    "lắp đặt karaoke",
    "audio tài lộc",
    "audiotailoc",
    "thiết bị âm thanh tphcm",
    "mua loa tphcm",
  ],
  authors: [{ name: "Audio Tài Lộc", url: CANONICAL_BASE }],
  creator: "Audio Tài Lộc",
  publisher: "Audio Tài Lộc",
  metadataBase: new URL(CANONICAL_BASE),
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
    description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao: Dàn karaoke, Loa, Ampli, Micro. Dịch vụ lắp đặt, bảo hành uy tín tại TP.HCM. Hotline: 0768 426 262",
    type: "website",
    locale: "vi_VN",
    url: CANONICAL_BASE,
    siteName: "Audio Tài Lộc",
    images: [
      {
        url: `${CANONICAL_BASE}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
    description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao: Dàn karaoke, Loa, Ampli, Micro. Hotline: 0768 426 262",
    images: [`${CANONICAL_BASE}/og-image.jpg`],
  },
  alternates: {
    canonical: CANONICAL_BASE,
    languages: {
      'vi-VN': CANONICAL_BASE,
    },
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  category: "Electronics",
  classification: "Audio Equipment Store",
  other: {
    'geo.region': 'VN-SG',
    'geo.placename': 'Ho Chi Minh City',
    'geo.position': '10.8231;106.6297',
    'ICBM': '10.8231, 106.6297',
    'rating': 'general',
    'revisit-after': '7 days',
    'language': 'Vietnamese',
    'distribution': 'global',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to critical domains for faster LCP */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://api.audiotailoc.com" />
        <link rel="dns-prefetch" href="https://api.audiotailoc.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <OrganizationStructuredData />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <CartProvider>

              

              <Header />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--background)",
                    color: "var(--foreground)",
                  },
                  success: {
                    duration: 3000,
                  },
                  error: {
                    duration: 5000,
                  },
                }}
              />
              <LazyChatWidget />
            </CartProvider>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <WebVitalsReporter />
      </body>
    </html>
  );
}